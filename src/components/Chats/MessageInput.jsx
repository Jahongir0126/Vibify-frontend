import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './MessageInput.css';

const MessageInput = ({ onMessageSent, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onMessageSent(message);
      setMessage('');
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        placeholder="Введите сообщение..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={!message.trim() || disabled}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default MessageInput; 