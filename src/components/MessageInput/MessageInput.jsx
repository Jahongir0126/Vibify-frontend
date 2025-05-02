import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSmile, faTimes } from '@fortawesome/free-solid-svg-icons';
import './MessageInput.scss';

const EmojiPicker = ({ onEmojiSelect, onClose, isDarkMode, emojiPacks }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className={`emoji-picker ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="emoji-picker-header">
        <h5>Стикеры</h5>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="emoji-tabs">
        {emojiPacks.map((pack, index) => (
          <button 
            key={index}
            className={`emoji-tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {pack.name}
          </button>
        ))}
      </div>
      
      <div className="emoji-grid">
        {emojiPacks[activeTab].stickers.map((emoji, index) => (
          <button 
            key={index} 
            className="emoji-item"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

const MessageInput = ({ onMessageSent, disabled, isDarkMode, placeholder = 'Напишите сообщение...' }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const emojiButtonRef = useRef(null);
  
  // Стандартные наборы стикеров
  const emojiPacks = [

    {
      name: 'Эмоции',
      stickers: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰']
    },
    {
      name: 'Жесты',
      stickers: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '🖐️', '✋', '👋', '🤚', '🙌', '👐', '🤲', '🙏']
    },
    {
      name: 'Объекты',
      stickers: ['💯', '💢', '💫', '💥', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '❤️', '🧡']
    }
  ];

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

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    textareaRef.current.focus();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
  };

  // Закрыть эмодзи-пикер при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && 
          emojiButtonRef.current && 
          !emojiButtonRef.current.contains(event.target) && 
          !event.target.closest('.emoji-picker')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="message-input-container">
      {error && <div className="error-message">{error}</div>}
      
      <form className="message-input-form" onSubmit={handleSubmit}>
        <div className="emoji-button-container">
          <button 
            type="button"
            ref={emojiButtonRef}
            className={`emoji-button ${isDarkMode ? 'dark' : 'light'}`}
            onClick={toggleEmojiPicker}
            disabled={disabled}
          >
            <FontAwesomeIcon icon={faSmile} />
          </button>
          
          {showEmojiPicker && (
            <EmojiPicker 
              onEmojiSelect={handleEmojiSelect} 
              onClose={() => setShowEmojiPicker(false)} 
              isDarkMode={isDarkMode}
              emojiPacks={emojiPacks}
            />
          )}
        </div>
        
        <input
          ref={textareaRef}
          className={`message-input ${isDarkMode ? 'dark' : 'light'}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        
        <button 
          type="submit" 
          className={`send-button ${isDarkMode ? 'dark' : 'light'}`}
          disabled={disabled || !message.trim()}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;