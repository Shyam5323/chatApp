import ItemList from "@/components/shared/item-list/itemList";
import React from "react";

type props = React.PropsWithChildren<{}>;
const conversationLayout = ({ children }: props) => {
  return (
    <>
      <ItemList title="Conversation">Conversation page</ItemList>
      {children}
    </>
  );
};

export default conversationLayout;
