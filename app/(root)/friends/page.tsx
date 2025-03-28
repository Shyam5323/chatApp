"use client";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/itemList";
import React from "react";
import AddFriendDialogue from "./_components/AddFriendDialogue";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import Request from "./_components/Request";

const FriendsPage = () => {
  const requests = useQuery(api.requests.get);
  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialogue />}>
        {requests ? (
          requests.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No requests found
            </p>
          ) : (
            requests.map((request) => {
              return (
                <Request
                  key={request.request._id}
                  id={request.request._id}
                  imageUrl={request.sender.imageUrl}
                  username={request.sender.username}
                  email={request.sender.email}
                />
              );
            })
          )
        ) : (
          <Loader2 className="h-8 w-8" />
        )}
      </ItemList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
