import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './Chats.css';

const Chats = ({ currentUserId, selectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const handleMessageSent = (newMessage) => {
    if (newMessage) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Чат с пользователем {selectedUserId}</h2>
      </div>
      <div className="chat-messages">
        <MessageList userId={selectedUserId} />
      </div>
      {error && <div className="chat-error">{error}</div>}
      <div className="chat-input">
        <MessageInput 
          senderId={currentUserId}
          receiverId={selectedUserId}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
};

export default Chats;
