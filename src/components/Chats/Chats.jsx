import React, { useState, useEffect, useRef } from 'react';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import './Chats.scss';

const Chats = ({ currentUserId, selectedUserId, onChatUpdated }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const pollingIntervalRef = useRef(null);
  
  // Функция для загрузки профиля пользователя
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const response = await fetch(`http://localhost:3000/profile/${selectedUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return;
      
      const data = await response.json();
      setUserProfile(data);
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
      
      // Получаем токен для авторизации
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Ошибка авторизации. Пожалуйста, войдите снова.');
        setLoading(false);
        return;
      }
      
      // Делаем запрос к API для получения сообщений
      const response = await fetch(`http://localhost:3000/message/${selectedUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Преобразование данных в формат, ожидаемый компонентом
      const formattedMessages = data
        .filter(msg => 
          // Фильтруем сообщения: только те, которые отправлены текущим пользователем
          // или получены от выбранного пользователя
          (msg.senderId === currentUserId && msg.receiverId === selectedUserId) ||
          (msg.senderId === selectedUserId && msg.receiverId === currentUserId)
        )
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
      
      // Если API недоступен и у нас еще нет сообщений, используем демо-данные
     
      
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
    
    // Получаем данные пользователя из токена
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Ошибка авторизации. Пожалуйста, войдите снова.');
        return;
      }
      
      // Декодируем токен, чтобы узнать ID текущего пользователя
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const tokenUserId = payload.id || payload.userId;
      
      // Проверяем, что текущий пользователь отправляет сообщение от своего имени
      if (tokenUserId !== currentUserId) {
        setError('Ошибка: невозможно отправить сообщение от имени другого пользователя.');
        return;
      }
      
      const newMessage = {
        senderId: currentUserId,
        receiverId: selectedUserId,
        content: messageText
      };
      
      // Отправляем сообщение через API
      const response = await fetch('http://localhost:3000/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }
      
      // Проверяем, содержит ли ответ какие-либо данные
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json')) {
        // Пытаемся распарсить JSON, только если сервер вернул JSON
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }
      
      // Добавляем сообщение в список (используем данные от сервера или генерируем ID)
      const sentMessage = {
        id: data.messageId || Date.now().toString(),
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
      if (!err.message.includes('API')) {
        setError('Сообщение отправлено локально. Возможно, были проблемы с сервером.');
      }
    }
  };

  // Обработчик редактирования сообщения
  const handleMessageEdit = async (messageId, newText) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Ошибка авторизации. Пожалуйста, войдите снова.');
        return false;
      }
      
      const response = await fetch(`http://localhost:3000/message/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId,
          content: newText
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }
      
      // Обновляем сообщение в списке даже если сервер не вернул данные
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, text: newText } : msg
        )
      );
      
      return true;
    } catch (err) {
      console.error('Ошибка при редактировании сообщения:', err);
      
      // Если ошибка с API, все равно обновляем сообщение локально
      if (err.message.includes('API')) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === messageId ? { ...msg, text: newText } : msg
          )
        );
        setError('Сообщение обновлено локально. Возможно, были проблемы с сервером.');
        return true;
      } else {
        setError('Не удалось отредактировать сообщение. Пожалуйста, попробуйте позже.');
        return false;
      }
    }
  };

  // Обработчик удаления сообщения
  const handleMessageDelete = async (messageId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Ошибка авторизации. Пожалуйста, войдите снова.');
        return false;
      }
      
      const response = await fetch(`http://localhost:3000/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }
      
      // Удаляем сообщение из списка
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
      
      return true;
    } catch (err) {
      console.error('Ошибка при удалении сообщения:', err);
      
      // Если ошибка с API, все равно удаляем сообщение локально
      if (err.message.includes('API')) {
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== messageId)
        );
        setError('Сообщение удалено локально. Возможно, были проблемы с сервером.');
        return true;
      } else {
        setError('Не удалось удалить сообщение. Пожалуйста, попробуйте позже.');
        return false;
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>
          {userProfile ? (
            <div className="chat-user-info">
              <img 
                src={userProfile.avatarUrl || userProfile.photoUrl || "https://via.placeholder.com/30"} 
                alt="User avatar"
                className="chat-user-avatar" 
              />
              <span>{userProfile.bio || selectedUserId}</span>
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
          />
        )}
      </div>
      {error && <div className="chat-error">{error}</div>}
      <div className="chat-input">
        <MessageInput 
          onMessageSent={handleMessageSent}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Chats;
