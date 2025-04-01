"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import Message from "./Message";

type Props = {};
const Body = (props: Props) => {
  const params = useParams();
  const conversationId = params?.conversationId as Id<"conversations">;

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<"conversations">,
  });
  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-2 no-scrollbar">
      {messages?.map(
        ({ message, senderImage, senderName, isCurrentUser }, index) => {
          const lastByUser =
            messages[index - 1]?.message.senderId ===
            messages[index].message.senderId;

          return (
            <Message
              key={message._id}
              fromCurrentUser={isCurrentUser}
              senderImage={senderImage}
              senderName={senderName}
              lastByUser={lastByUser}
              content={message.content}
              createdAt={message._creationTime}
              type={message.type}
            />
          );
        }
      )}
    </div>
  );
};

export default Body;
