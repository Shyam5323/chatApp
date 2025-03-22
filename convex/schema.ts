import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  logs: defineTable({
    eventType: v.string(),
    data: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  requests: defineTable({
    sender: v.id("users"),
    reciever: v.id("users"),
  })
    .index("by_reciever", ["reciever"])
    .index("by_reciever_sender", ["reciever", "sender"]),
});
