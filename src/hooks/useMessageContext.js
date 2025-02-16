import { useContext } from "react";
import { MessageContext } from "../context/MessageContext";

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

export const useMessages = () => {
  const { messages } = useMessageContext();
  return messages;
};

export const useAddMessage = () => {
  const { addMessage } = useMessageContext();
  return addMessage;
};

export const useRemoveMessage = () => {
  const { removeMessage } = useMessageContext();
  return removeMessage;
};
