import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './MessageList.scss';

const MessageList = ({ messages, currentUserId, onEditMessage, onDeleteMessage }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Автоматически скрыть сообщение об ошибке через 5 секунд
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Автоматическая прокрутка к последнему сообщению при обновлении списка
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list-empty">
        <p>У вас пока нет сообщений. Начните общение!</p>
      </div>
    );
  }

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  const handleEdit = (message) => {
    setEditingId(message.id);
    setEditText(message.text);
  };

  const saveEdit = async (id) => {
    try {
      setError(null);
      const success = await onEditMessage(id, editText);
      if (success) {
        setEditingId(null);
      }
    } catch (err) {
      console.error('Ошибка при редактировании сообщения:', err);
      setError('Не удалось отредактировать сообщение');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      return;
    }

    try {
      setError(null);
      await onDeleteMessage(id);
    } catch (err) {
      console.error('Ошибка при удалении сообщения:', err);
      setError('Не удалось удалить сообщение');
    }
  };

  return (
    <div className="message-list">
      {error && <div className="message-error">{error}</div>}
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === currentUserId;
        const isEditing = message.id === editingId;
        
        return (
          <div 
            key={message.id || index} 
            className={`message-item ${isCurrentUser ? 'message-outgoing' : 'message-incoming'}`}
          >
            <div className="message-content">
              {isEditing ? (
                <div className="message-edit">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-textarea"
                  />
                  <div className="edit-actions">
                    <button onClick={() => saveEdit(message.id)}>Сохранить</button>
                    <button onClick={() => setEditingId(null)}>Отмена</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {isCurrentUser && (
                      <div className="message-actions">
                        <button onClick={() => handleEdit(message)}>
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button onClick={() => handleDelete(message.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    )}
                    {formatTime(message.timestamp)}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 