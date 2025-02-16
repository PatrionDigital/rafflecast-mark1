import { useMessages, useRemoveMessage } from "../hooks/useMessageContext";

const MessageDisplay = () => {
  const messages = useMessages();
  const removeMessage = useRemoveMessage();

  return (
    <div className="message-container">
      {messages.map(({ id, text, type }) => (
        <div key={id} className={`message message-${type}`}>
          <span>{text}</span>
          <button
            onClick={() => removeMessage(id)}
            className="message-close"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay;
