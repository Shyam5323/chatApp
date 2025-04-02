import { ConvexError } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { Id } from "./_generated/dataModel";
export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const conversationMembership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    console.log("Conversation Membership:", conversationMembership);

    const conversations = await Promise.all(
      conversationMembership?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) {
          throw new ConvexError("Conversation not found");
        }
        return conversation;
      })
    );

    const conversationsWithDetails = await Promise.all(
      conversations?.map(async (conversation, index) => {
        const allConversationMemberships = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .collect();

        const lastMessage = await getLastMessageDetails({
          ctx,
          id: conversation.lastMessageId,
        });

        // Get the actual message object to access its creation time
        const lastMessageObject = conversation.lastMessageId
          ? await ctx.db.get(conversation.lastMessageId)
          : null;

        const lastMessageTime = lastMessageObject
          ? lastMessageObject._creationTime
          : 0;

        const lastSeenMessage = conversationMembership[index].lastSeenMessage
          ? await ctx.db.get(conversationMembership[index].lastSeenMessage)
          : null;

        const lastSeenMessageTime = lastSeenMessage
          ? lastSeenMessage._creationTime
          : -1;

        const unseenMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .filter((q) => q.gt(q.field("_creationTime"), lastSeenMessageTime))
          .filter((q) => q.neq(q.field("senderId"), currentUser._id))
          .collect();

        if (conversation.isGroup) {
          return {
            conversation,
            lastMessage,
            lastMessageTime, // Add this field for sorting
            unseenCount: unseenMessages.length,
          };
        }

        const otherMembership = allConversationMemberships?.filter(
          (membership) => membership.memberId !== currentUser._id
        )[0];

        if (!otherMembership) {
          throw new ConvexError("Other membership not found");
        }

        const otherMember = await ctx.db.get(otherMembership.memberId);
        return {
          conversation,
          otherMember,
          lastMessage,
          lastMessageTime, // Add this field for sorting
          unseenCount: unseenMessages.length,
        };
      })
    );

    conversationsWithDetails.sort(
      (a, b) => b.lastMessageTime - a.lastMessageTime
    );

    return conversationsWithDetails;
  },
});
const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<"messages"> | undefined;
}) => {
  if (!id) {
    return null;
  }
  const message = await ctx.db.get(id);
  if (!message) {
    return null;
  }
  const sender = await ctx.db.get(message.senderId);

  if (!sender) {
    return null;
  }
  const content = getMessageContent(
    message.type,
    message.content as unknown as string
  );

  return {
    content,
    sender: sender.username,
  };
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    case "image":
      return "Image";
    case "video":
      return "Video";
    case "audio":
      return "Audio";
    default:
      return content;
  }
};
