import { createContext, useState } from "react";
import PropTypes from "prop-types";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (message, type = "info") => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text: message, type }]);

    // Automatically remove the message after 5 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 5000);
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, removeMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

MessageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MessageContext };
