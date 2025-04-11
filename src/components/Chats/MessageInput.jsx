import React, { useState } from 'react';
import api from '../../Api';
import './MessageInput.css';

const MessageInput = ({ senderId, receiverId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const messageData = {
        senderId,
        receiverId,
        content: message
      };

      const response = await api.sendMessage(messageData);
      
      if (response.success) {
        setMessage('');
        onMessageSent && onMessageSent(response.data);
      } else {
        // Обработка ошибки при отправке
        let errorMessage = 'Ошибка при отправке сообщения';
        
        if (response.status === 409) {
          errorMessage = 'Сообщение уже отправлено или есть конфликт данных';
        } else if (response.error) {
          errorMessage = response.error;
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      setError('Ошибка при отправке сообщения');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
          disabled={sending}
        />
        <button type="submit" disabled={sending || !message.trim()}>
          {sending ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </form>
  );
};

export default MessageInput; 