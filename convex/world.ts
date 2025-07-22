import { ConvexError, v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import { characters } from '../data/characters';
import { insertInput } from './aiTown/insertInput';
import {
  DEFAULT_NAME,
  ENGINE_ACTION_DURATION,
  IDLE_WORLD_TIMEOUT,
  WORLD_HEARTBEAT_INTERVAL,
} from './constants';
import { playerId } from './aiTown/ids';
import { kickEngine, startEngine, stopEngine } from './aiTown/main';
import { engineInsertInput } from './engine/abstractGame';

/* -------------------------- PUBLIC QUERIES -------------------------- */

export const defaultWorldStatus = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('worldStatus')
      .filter((q) => q.eq(q.field('isDefault'), true))
      .first();
  },
});

export const getDefaultWorldId = query(async ({ db }) => {
  const worldStatus = await db
    .query('worldStatus')
    .filter((q) => q.eq(q.field('isDefault'), true))
    .unique();

  if (!worldStatus) throw new Error('Default world not found');
  return worldStatus.worldId;
});

export const userStatus = query({
  args: {
    worldId: v.id('worlds'),
  },
  handler: async () => {
    return DEFAULT_NAME;
  },
});

export const worldState = query({
  args: {
    worldId: v.id('worlds'),
  },
  handler: async (ctx, args) => {
    const world = await ctx.db.get(args.worldId);
    if (!world) throw new Error(`Invalid world ID: ${args.worldId}`);

    const worldStatus = await ctx.db
      .query('worldStatus')
      .withIndex('worldId', (q) => q.eq('worldId', world._id))
      .unique();

    if (!worldStatus) throw new Error(`Missing world status for world: ${world._id}`);

    const engine = await ctx.db.get(worldStatus.engineId);
    if (!engine) throw new Error(`Invalid engine ID: ${worldStatus.engineId}`);

    return { world, engine };
  },
});

export const gameDescriptions = query({
  args: {
    worldId: v.id('worlds'),
  },
  handler: async (ctx, args) => {
    const [playerDescriptions, agentDescriptions, worldMap] = await Promise.all([
      ctx.db
        .query('playerDescriptions')
        .withIndex('worldId', (q) => q.eq('worldId', args.worldId))
        .collect(),
      ctx.db
        .query('agentDescriptions')
        .withIndex('worldId', (q) => q.eq('worldId', args.worldId))
        .collect(),
      ctx.db
        .query('maps')
        .withIndex('worldId', (q) => q.eq('worldId', args.worldId))
        .first(),
    ]);

    if (!worldMap) throw new Error(`No map found for world: ${args.worldId}`);

    return { worldMap, playerDescriptions, agentDescriptions };
  },
});

export const previousConversation = query({
  args: {
    worldId: v.id('worlds'),
    playerId,
  },
  handler: async (ctx, args) => {
    const members = ctx.db
      .query('participatedTogether')
      .withIndex('playerHistory', (q) =>
        q.eq('worldId', args.worldId).eq('player1', args.playerId),
      )
      .order('desc');

    for await (const member of members) {
      const conversation = await ctx.db
        .query('archivedConversations')
        .withIndex('worldId', (q) =>
          q.eq('worldId', args.worldId).eq('id', member.conversationId),
        )
        .unique();

      if (!conversation) {
        throw new Error(`Invalid conversation ID: ${member.conversationId}`);
      }

      if (conversation.numMessages > 0) {
        return conversation;
      }
    }

    return null;
  },
});

/* -------------------------- PUBLIC MUTATIONS -------------------------- */

export const joinWorld = mutation({
  args: {
    worldId: v.id('worlds'),
  },
  handler: async (ctx, args) => {
    const world = await ctx.db.get(args.worldId);
    if (!world) throw new ConvexError(`Invalid world ID: ${args.worldId}`);

    return await insertInput(ctx, world._id, 'join', {
      name: DEFAULT_NAME,
      character: characters[Math.floor(Math.random() * characters.length)].name,
      description: `${DEFAULT_NAME} is a human player`,
      tokenIdentifier: DEFAULT_NAME,
    });
  },
});

export const leaveWorld = mutation({
  args: {
    worldId: v.id('worlds'),
  },
  handler: async (ctx, args) => {
    const world = await ctx.db.get(args.worldId);
    if (!world) throw new Error(`Invalid world ID: ${args.worldId}`);

    const existingPlayer = world.players.find((p) => p.human === DEFAULT_NAME);
    if (!existingPlayer) return;

    await insertInput(ctx, world._id, 'leave', {
      playerId: existingPlayer.id,
    });
  },
});

export const sendWorldInput = mutation({
  args: {
    engineId: v.id('engines'),
    name: v.string(),
    args: v.any(),
  },
  handler: async (ctx, args) => {
    return await engineInsertInput(ctx, args.engineId, args.name as any, args.args);
  },
});

export const heartbeatWorld = mutation({
  args: {
    worldId: v.id('worlds'),
  },
  handler: async (ctx, args) => {
    const worldStatus = await ctx.db
      .query('worldStatus')
      .withIndex('worldId', (q) => q.eq('worldId', args.worldId))
      .first();

    if (!worldStatus) throw new Error(`Invalid world ID: ${args.worldId}`);

    const now = Date.now();
    const lastViewed = worldStatus.lastViewed ?? now;

    if (lastViewed < now - WORLD_HEARTBEAT_INTERVAL / 2) {
      await ctx.db.patch(worldStatus._id, {
        lastViewed: Math.max(lastViewed, now),
      });
    }

    if (worldStatus.status === 'stoppedByDeveloper') {
      console.debug(`World ${worldStatus._id} is stopped by developer.`);
    }

    if (worldStatus.status === 'inactive') {
      console.log(`Restarting inactive world ${worldStatus._id}...`);
      await ctx.db.patch(worldStatus._id, { status: 'running' });
      await startEngine(ctx, worldStatus.worldId);
    }
  },
});

/* -------------------------- INTERNAL MUTATIONS -------------------------- */

export const stopInactiveWorlds = internalMutation({
  handler: async (ctx) => {
    const cutoff = Date.now() - IDLE_WORLD_TIMEOUT;
    const worlds = await ctx.db.query('worldStatus').collect();

    for (const worldStatus of worlds) {
      if (worldStatus.status !== 'running') continue;
      if (worldStatus.lastViewed >= cutoff) continue;

      console.log(`Stopping inactive world ${worldStatus._id}`);
      await ctx.db.patch(worldStatus._id, { status: 'inactive' });
      await stopEngine(ctx, worldStatus.worldId);
    }
  },
});

export const restartDeadWorlds = internalMutation({
  handler: async (ctx) => {
    const engineTimeout = Date.now() - ENGINE_ACTION_DURATION * 2;
    const worlds = await ctx.db.query('worldStatus').collect();

    for (const worldStatus of worlds) {
      if (worldStatus.status !== 'running') continue;

      const engine = await ctx.db.get(worldStatus.engineId);
      if (!engine) throw new Error(`Invalid engine ID: ${worldStatus.engineId}`);

      if (engine.currentTime && engine.currentTime < engineTimeout) {
        console.warn(`Restarting dead engine ${engine._id}...`);
        await kickEngine(ctx, worldStatus.worldId);
      }
    }
  },
});
