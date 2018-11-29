import React from "react";

import Message from "./Message";

const MessagesList = ({ messages, toggleSelect, toggleStar }) => {
  const messageComponents = messages.map(message => (
    <Message
      key={message.id}
      message={message}
      toggleSelect={toggleSelect}
      toggleStar={toggleStar}
    />
  ));

  return <div>{messageComponents}</div>;
};

export default MessagesList;
