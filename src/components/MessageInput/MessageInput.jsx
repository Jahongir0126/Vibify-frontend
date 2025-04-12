import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './MessageInput.scss';

const MessageInput = ({ onMessageSent, disabled }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  // Автоматически изменять высоту в зависимости от содержимого
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  // Обработчик клавиш - отправка по Enter (без Shift)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Введите сообщение');
      setTimeout(() => setError(''), 2000);
      return;
    }
    
    onMessageSent(message);
    setMessage('');
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <input
        ref={textareaRef}
        className="message-input "
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Напишите сообщение..."
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={disabled || !message.trim()}
      >
        <FontAwesomeIcon className='m-0' icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default MessageInput; 