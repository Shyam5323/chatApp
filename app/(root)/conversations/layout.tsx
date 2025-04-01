"use client";
import ItemList from "@/components/shared/item-list/itemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMConversationItem from "./_components/DMConversationItem";

type props = React.PropsWithChildren<{}>;
const conversationLayout = ({ children }: props) => {
  const conversations = useQuery(api.conversations.get);
  // console.log("Conversations:", conversations);
  return (
    <>
      <ItemList title="Conversation">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-[calc(100svh-180px)] flex items-center justify-center">
              No conversations yet
            </p>
          ) : (
            conversations.map((conversations) => {
              console.log("Conversation map:", conversations);
              return conversations.conversation.isGroup ? null : (
                <DMConversationItem
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  username={conversations.otherMember?.username || ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                />
              );
            })
          )
        ) : (
          <Loader2></Loader2>
        )}
      </ItemList>

      {children}
    </>
  );
};

export default conversationLayout;
