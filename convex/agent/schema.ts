import { v } from 'convex/values';
import { defineSchema, defineTable } from 'convex/server';
import { playerId, conversationId } from '../aiTown/ids';
import { EMBEDDING_DIMENSION } from '../util/llm';

export const memoryFields = {
  playerId,
  description: v.string(),
  embeddingId: v.id('memoryEmbeddings'),
  importance: v.number(),
  lastAccess: v.number(),
  data: v.union(
    // Setting up dynamics between players
    v.object({
      type: v.literal('relationship'),
      // The player this memory is about, from the perspective of the player
      // whose memory this is.
      playerId,
    }),
    v.object({
      type: v.literal('conversation'),
      conversationId,
      // The other player(s) in the conversation.
      playerIds: v.array(playerId),
    }),
    v.object({
      type: v.literal('reflection'),
      relatedMemoryIds: v.array(v.id('memories')),
    }),
  ),
};

export const memoryTables = {
  memories: defineTable(memoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId_type', ['playerId', 'data.type'])
    .index('playerId', ['playerId']),
  memoryEmbeddings: defineTable({
    playerId,
    embedding: v.array(v.float64()),
  }).vectorIndex('embedding', {
    vectorField: 'embedding',
    filterFields: ['playerId'],
    dimensions: EMBEDDING_DIMENSION,
  }),
};

export const agentTables = {
  ...memoryTables,
  embeddingsCache: defineTable({
    textHash: v.bytes(),
    embedding: v.array(v.float64()),
  }).index('text', ['textHash']),
};

// Define the complete schema with all tables
export default defineSchema({
  // Include all the agent tables
  ...agentTables,
  
  // Campaign brief tables
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
  
  // Messages table with campaign brief support
  messages: defineTable({
    author: v.string(),
    text: v.string(),
    timestamp: v.number(),
    conversationId: v.optional(v.string()),
    briefId: v.optional(v.id("campaignBriefs")),
    isAnnouncement: v.optional(v.boolean()),
    worldId: v.optional(v.id("worlds")),
    messageUuid: v.optional(v.string()),
  }),
});