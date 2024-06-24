import React from "react";
import { Empty, Flex } from "antd";

const ChatPlaceholder = () => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{ width: "100%", height: "100%" }}
    >
      <Empty description="Select a conversation to start chat!" />
    </Flex>
  );
};

export default ChatPlaceholder;
