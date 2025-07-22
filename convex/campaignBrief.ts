import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBrief = mutation({
  args: {
    company: v.string(),
    product: v.string(),
    objective: v.string(),
    targetAudience: v.string(),
    budget: v.string(),
    timeline: v.string(),
    constraints: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const briefId = await ctx.db.insert("campaignBriefs", {
      ...args,
      status: "active",
      createdAt: Date.now(),
    });
    
    // Create a system message about the new brief
    await ctx.db.insert("messages", {
      author: "system" as any, // System announcements don't have a player ID
      text: `🎯 New Campaign Brief: ${args.company} - ${args.product}. Objective: ${args.objective}`,
      briefId,
      isAnnouncement: true,
      timestamp: Date.now(),
      messageUuid: crypto.randomUUID(),
      conversationId: "system" as any, // System messages don't belong to a conversation
    });
    
    return briefId;
  },
});

export const getActiveBrief = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("campaignBriefs")
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .first();
  },
});

export const getAllBriefs = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("campaignBriefs")
      .order("desc")
      .collect();
  },
});

export const archiveBrief = mutation({
  args: {
    briefId: v.id("campaignBriefs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.briefId, { status: "archived" });
  },
});

export const updateBrief = mutation({
  args: {
    briefId: v.id("campaignBriefs"),
    company: v.optional(v.string()),
    product: v.optional(v.string()),
    objective: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    budget: v.optional(v.string()),
    timeline: v.optional(v.string()),
    constraints: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { briefId, ...updates } = args;
    await ctx.db.patch(briefId, updates);
  },
});

export const deleteBrief = mutation({
  args: {
    briefId: v.id("campaignBriefs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.briefId);
  },
});