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
      author: "System",
      text: `New Campaign Brief: ${args.company} - ${args.product}. Objective: ${args.objective}`,
      briefId,
      isAnnouncement: true,
      timestamp: Date.now(),
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