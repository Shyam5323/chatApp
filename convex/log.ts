import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const logEvent = internalMutation({
  args: {
    eventType: v.string(),
    data: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("logs", {
      eventType: args.eventType,
      data: args.data,
      timestamp: Date.now(),
    });
  },
});
