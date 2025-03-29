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
  return (
    <>
      <ItemList title="Conversation">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations yet
            </p>
          ) : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup ? null : (
                <DMConversationItem
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  username={conversations.otherMember?.username || ""}
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
