import React, { useState, useEffect, useRef } from 'react';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import api from '../../Api';
import './Chats.scss';

const Chats = ({ currentUserId, selectedUserId, onChatUpdated, isDarkMode, isCommunityChat }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const pollingIntervalRef = useRef(null);
  
  // Функция для загрузки профиля пользователя
  const fetchUserProfile = async () => {
    try {
      if (!selectedUserId) return;
      
      const data = await api.getProfileById(selectedUserId);
      if (data) {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Ошибка при загрузке профиля:', err);
    }
  };

  // Функция для загрузки сообщений
  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      if (!currentUserId || !selectedUserId) {
        setError('Ошибка: отсутствуют данные пользователей');
        setLoading(false);
        return;
      }
      
      // В зависимости от типа чата используем разные методы API
      const data =  await api.getUserMessages(selectedUserId);
      
      if (!Array.isArray(data)) {
        throw new Error('Некорректный ответ от сервера');
      }
      
      // Преобразование данных в формат, ожидаемый компонентом
      const formattedMessages = data
        .filter(msg => {
          if (isCommunityChat) {
            // Для чата сообщества показываем все сообщения
            return true;
          } else {
            // Для личного чата фильтруем сообщения между двумя пользователями
            return (msg.senderId === currentUserId && msg.receiverId === selectedUserId) ||
                   (msg.senderId === selectedUserId && msg.receiverId === currentUserId);
          }
        })
        .map(msg => ({
          id: msg.messageId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          text: msg.content,
          timestamp: msg.createdAt || new Date().toISOString()
        }));
      
      // Проверяем, есть ли новые сообщения
      if (JSON.stringify(formattedMessages) !== JSON.stringify(messages)) {
        setMessages(formattedMessages);
      }
      
      if (showLoading) {
        setLoading(false);
      }
    } catch (err) {
      console.error('Ошибка при загрузке сообщений:', err);
      
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Загружаем профиль пользователя и сообщения при монтировании компонента
  useEffect(() => {
    fetchUserProfile();
    fetchMessages();
    
    // Настраиваем интервал для периодического обновления сообщений (каждые 3 секунды)
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(false); // Не показываем индикатор загрузки при периодическом обновлении
    }, 3000);
    
    // Очистка при размонтировании компонента
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentUserId, selectedUserId]);

  // Автоматически скрыть сообщение об ошибке через 5 секунд
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Обработчик отправки сообщения
  const handleMessageSent = async (messageText) => {
    if (!messageText.trim()) return;
    
    try {
      const userIdFromToken = getUserIdFromToken();
      
      if (!userIdFromToken) {
        showToast.error('Ошибка авторизации. Пожалуйста, войдите снова.');
        setError('Ошибка авторизации. Пожалуйста, войдите снова.');
        return;
      }
      
      // Проверяем, что текущий пользователь отправляет сообщение от своего имени
      if (userIdFromToken !== currentUserId) {
        showToast.error('Ошибка: невозможно отправить сообщение от имени другого пользователя.');
        setError('Ошибка: невозможно отправить сообщение от имени другого пользователя.');
        return;
      }
      
      const messageData = {
        senderId: currentUserId,
        receiverId: selectedUserId,
        content: messageText
      };
      
      // Отправляем сообщение через API
      const response = await api.sendMessage(messageData);
      
      if (!response.status==204) {
        throw new Error(response.error || 'Ошибка при отправке сообщения');
      }
      
      // Добавляем сообщение в список (используем данные от сервера или генерируем ID)
      const sentMessage = {
        id: response.data?.messageId || Date.now().toString(),
        senderId: currentUserId,
        receiverId: selectedUserId,
        text: messageText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, sentMessage]);
      
      // Обновим сообщения, чтобы получить правильный ID с сервера
      setTimeout(() => {
        fetchMessages(false);
        if (onChatUpdated) onChatUpdated(); // Уведомляем родителя об обновлении
      }, 500);
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      showToast.error('Ошибка при отправке сообщения');
      
      // Если API недоступен или вернул ошибку, добавляем сообщение локально
      const localMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        receiverId: selectedUserId,
        text: messageText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, localMessage]);
      
      // Показываем ошибку, но не блокируем добавление сообщения
      setError('Сообщение отправлено локально. Возможно, были проблемы с сервером.');
    }
  };

  // Обработчик редактирования сообщения
  const handleMessageEdit = async (messageId, newText) => {
    try {
      const messageData = {
        messageId,
        content: newText
      };
      
      const response = await api.updateMessage(messageId, messageData);
      
      // Обновляем сообщение в списке
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, text: newText } : msg
        )
      );
      
      return true;
    } catch (err) {
      console.error('Ошибка при редактировании сообщения:', err);
      showToast.error('Не удалось отредактировать сообщение');
      
      // Если ошибка с API, все равно обновляем сообщение локально
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, text: newText } : msg
        )
      );
      setError('Сообщение обновлено локально. Возможно, были проблемы с сервером.');
      return true;
    }
  };

  // Обработчик удаления сообщения
  const handleMessageDelete = async (messageId) => {
    try {
      await api.deleteMessage(messageId);
      
      // Удаляем сообщение из списка
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
      
      return true;
    } catch (err) {
      console.error('Ошибка при удалении сообщения:', err);
      showToast.error('Не удалось удалить сообщение');
      
      // Если ошибка с API, все равно удаляем сообщение локально
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
      setError('Сообщение удалено локально. Возможно, были проблемы с сервером.');
      return true;
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>
          {userProfile ? (
            <div className="chat-user-info">
              <img 
                src={userProfile.avatarUrl || userProfile.photoUrl || "https://mir-s3-cdn-cf.behance.net/project_modules/fs/5e227329363657.55ef8df90a1ca.png"} 
                alt="User avatar"
                className="chat-user-avatar" 
              />
              <span>{userProfile.nickname || selectedUserId}</span>
            </div>
          ) : (
            `Чат с пользователем ${selectedUserId}`
          )}
        </h2>
        <div className="chat-status">
          <span className="status-connected">Подключено</span>
        </div>
      </div>
      <div className="chat-messages">
        {loading ? (
          <div className="message-list-loading">Загрузка сообщений...</div>
        ) : (
          <MessageList 
            messages={messages} 
            currentUserId={currentUserId} 
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

export default Chats;
