import React, { useState, useEffect, useRef } from 'react';
import CommunityMessageList from '../CommunityMessageList/СommunityMessageList';
import MessageInput from '../MessageInput/MessageInput';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import api from '../../Api';
import './CommunityChat.scss';

const CommunityChat = ({ currentUserId, selectedUserId, onChatUpdated, isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollingIntervalRef = useRef(null);

  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      if (!currentUserId || !selectedUserId) {
        setError('Ошибка: отсутствуют данные пользователей');
        setLoading(false);
        return;
      }
      const data = await api.getUserMessages(selectedUserId);

      if (!Array.isArray(data)) throw new Error('Некорректный ответ от сервера');

      const formatted = data.map(msg => ({
        id: msg.messageId,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        text: msg.content,
        timestamp: msg.createdAt || new Date().toISOString(),
      }));

      setMessages(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(formatted)) return formatted;
        return prev;
      });

      if (showLoading) setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке сообщений:', err);
      if (showLoading) setLoading(false);
    }
  };

  // Загружаем недостающие профили
  useEffect(() => {
    const fetchMissingProfiles = async () => {
      const uniqueSenderIds = [...new Set(messages.map(msg => msg.senderId))];
      const missing = uniqueSenderIds.filter(id => !userProfiles[id]);
      const newProfiles = {};
      await Promise.all(missing.map(async id => {
        try {
          const profile = await api.getProfileById(id);
          newProfiles[id] = profile;
        } catch (err) {
          console.error(`Ошибка загрузки профиля ${id}`, err);
        }
      }));
      setUserProfiles(prev => ({ ...prev, ...newProfiles }));
    };

    if (messages.length > 0) fetchMissingProfiles();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    pollingIntervalRef.current = setInterval(() => fetchMessages(false), 3000);
    return () => clearInterval(pollingIntervalRef.current);
  }, [currentUserId, selectedUserId]);

  const handleMessageSent = async (text) => {
    if (!text.trim()) return;
    try {
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId || tokenUserId !== currentUserId) {
        const errorMsg = 'Ошибка авторизации';
        setError(errorMsg);
        showToast.error(errorMsg);
        return;
      }

      const data = {
        senderId: currentUserId,
        receiverId: selectedUserId,
        content: text,
      };

      const res = await api.sendMessage(data);
      const newMsg = {
        id: res.data?.messageId || Date.now().toString(),
        senderId: currentUserId,
        receiverId: selectedUserId,
        text,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMsg]);
      setTimeout(() => {
        fetchMessages(false);
        if (onChatUpdated) onChatUpdated();
      }, 500);
    } catch (err) {
      console.error('Ошибка отправки:', err);
      showToast.error('Ошибка при отправке сообщения');
    }
  };

  const handleMessageEdit = async (id, newText) => {
    try {
      await api.updateMessage(id, { messageId: id, content: newText });
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, text: newText } : m)));
    } catch (err) {
      console.error('Ошибка при редактировании:', err);
      showToast.error('Ошибка при редактировании');
    }
  };

  const handleMessageDelete = async (id) => {
    try {
      await api.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      showToast.error('Ошибка при удалении');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {loading ? (
          <div className="message-list-loading">Загрузка сообщений...</div>
        ) : (
          <CommunityMessageList
            messages={messages}
            currentUserId={currentUserId}
            userProfiles={userProfiles}
            onEditMessage={handleMessageEdit}
            onDeleteMessage={handleMessageDelete}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
      {error && <div className="chat-error">{error}</div>}
      <div className="chat-input">
        <MessageInput
          onMessageSent={handleMessageSent}
          disabled={loading}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default CommunityChat;
