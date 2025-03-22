import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/itemList";
import React from "react";

const FriendsPage = () => {
  return (
    <>
      <ItemList title="Friends"> Friend Page</ItemList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
