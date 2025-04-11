import React, { useEffect, useState } from 'react';
import api from '../../Api';
import './MessageList.css';

const MessageList = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let response;
        if (userId) {
          response = await api.getUserMessages(userId);
        } else {
          response = await api.getAllMessages();
        }
        if (response) {
          setMessages(response);
        }
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке сообщений');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.deleteMessage(messageId);
      setMessages(messages.filter(msg => msg.messageId !== messageId));
    } catch (err) {
      setError('Ошибка при удалении сообщения');
    }
  };

  const handleUpdateMessage = async (messageId, content) => {
    try {
      const updatedMessage = await api.updateMessage(messageId, { content });
      setMessages(messages.map(msg => 
        msg.messageId === messageId ? { ...msg, content } : msg
      ));
    } catch (err) {
      setError('Ошибка при обновлении сообщения');
    }
  };

  if (loading) return <div className="message-list loading">Загрузка сообщений...</div>;
  if (error) return <div className="message-list error">{error}</div>;

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.messageId} className={`message ${message.isOwn ? 'own' : ''}`}>
          <div className="message-content">
            <div className="message-sender">ID отправителя: {message.senderId}</div>
            <div className="message-text">{message.content}</div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
              <div className="message-actions">
                <button onClick={() => handleUpdateMessage(message.messageId, prompt('Введите новый текст:', message.content))}>
                  Редактировать
                </button>
                <button onClick={() => handleDeleteMessage(message.messageId)}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList; 