import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { agentTables } from './agent/schema';
import { aiTownTables } from './aiTown/schema';
import { conversationId, playerId } from './aiTown/ids';
import { engineTables } from './engine/schema';

export default defineSchema({
  music: defineTable({
    storageId: v.string(),
    type: v.union(v.literal('background'), v.literal('player')),
  }),
  
  // Updated messages table with campaign brief support
  messages: defineTable({
    conversationId,
    messageUuid: v.string(),
    author: playerId,
    text: v.string(),
    worldId: v.optional(v.id('worlds')),
    // New fields for campaign briefs
    briefId: v.optional(v.id('campaignBriefs')),
    isAnnouncement: v.optional(v.boolean()),
    timestamp: v.optional(v.number()),
  })
    .index('conversationId', ['worldId', 'conversationId'])
    .index('messageUuid', ['conversationId', 'messageUuid']),
  
  // New campaign briefs table
  campaignBriefs: defineTable({
    company: v.string(),
    product: v.string(),
    objective: v.string(),
    targetAudience: v.string(),
    budget: v.string(),
    timeline: v.string(),
    constraints: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }),
  
  ...agentTables,
  ...aiTownTables,
  ...engineTables,
});