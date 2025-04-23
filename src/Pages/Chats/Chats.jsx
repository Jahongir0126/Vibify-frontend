import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import ChatsComponent from '../../components/Chats/Chats';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import api from '../../Api';
import './Chats.scss';

const ChatsPage = ({ isDarkMode }) => {
  const { userId } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const navigate = useNavigate();

  // Загрузка списка чатов
  const fetchChats = async () => {
    try {
      setChatLoading(true);
      
      if (!currentUserId) {
        setError('Необходима авторизация');
        setChatLoading(false);
        return;
      }

      // Получаем все сообщения пользователя
      const messages = await api.getAllMessages();

      if (!Array.isArray(messages)) {
        throw new Error('Некорректный ответ от сервера');
      }

      // Собираем уникальных пользователей из сообщений
      const chatUsers = new Map();
      
      messages.forEach(msg => {
        if (msg.senderId === currentUserId) {
          // Текущий пользователь отправил сообщение
          if (!chatUsers.has(msg.receiverId)) {
            chatUsers.set(msg.receiverId, {
              userId: msg.receiverId,
              lastMessage: msg.content,
              timestamp: msg.createdAt || new Date().toISOString()
            });
          } else if (new Date(msg.createdAt) > new Date(chatUsers.get(msg.receiverId).timestamp)) {
            // Обновляем последнее сообщение, если оно новее
            chatUsers.set(msg.receiverId, {
              ...chatUsers.get(msg.receiverId),
              lastMessage: msg.content,
              timestamp: msg.createdAt
            });
          }
        } else if (msg.receiverId === currentUserId) {
          // Текущий пользователь получил сообщение
          if (!chatUsers.has(msg.senderId)) {
            chatUsers.set(msg.senderId, {
              userId: msg.senderId,
              lastMessage: msg.content,
              timestamp: msg.createdAt || new Date().toISOString()
            });
          } else if (new Date(msg.createdAt) > new Date(chatUsers.get(msg.senderId).timestamp)) {
            // Обновляем последнее сообщение, если оно новее
            chatUsers.set(msg.senderId, {
              ...chatUsers.get(msg.senderId),
              lastMessage: msg.content,
              timestamp: msg.createdAt
            });
          }
        }
      });

      // Загружаем данные профилей для пользователей с активными чатами
      const chatList = Array.from(chatUsers.values());
      const userProfiles = await Promise.all(
        chatList.map(async (chat) => {
          try {
            const profile = await api.getProfileById(chat.userId);
            return { ...chat, profile };
          } catch (err) {
            console.error('Ошибка при загрузке профиля:', err);
            return chat;
          }
        })
      );

      // Сортируем чаты по времени последнего сообщения (сначала новые)
      userProfiles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setChats(userProfiles);
      setChatLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке чатов:', err);
      showToast.error('Не удалось загрузить чаты. Пожалуйста, попробуйте позже.');
      setError('Не удалось загрузить чаты. Пожалуйста, попробуйте позже.');
      setChatLoading(false);
    }
  };

  // Инициализация страницы
  useEffect(() => {
    const userIdFromToken = getUserIdFromToken();
    setCurrentUserId(userIdFromToken);

    if (!userIdFromToken) {
      showToast.error('Необходима авторизация для доступа к чатам');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Убедимся, что пользователь не пытается просматривать чат с самим собой
    if (userIdFromToken && userId === userIdFromToken) {
      showToast.warning('Вы не можете просматривать чат с самим собой');
      setError('Вы не можете просматривать чат с самим собой');
      setTimeout(() => navigate('/chats'), 2000);
    }

    setLoading(false);
  }, [userId, navigate]);

  // Загрузка списка чатов при изменении текущего пользователя
  useEffect(() => {
    if (currentUserId) {
      fetchChats();
      
      // Настраиваем периодическое обновление списка чатов
      const chatPollingInterval = setInterval(() => {
        fetchChats();
      }, 10000); // Обновляем каждые 10 секунд
      
      return () => clearInterval(chatPollingInterval);
    }
  }, [currentUserId]);

  // Форматируем дату для отображения
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return <div className="chat-loading">Загрузка чата...</div>;
  }

  if (error) {
    return <div className="chat-error">{error}</div>;
  }

  // Компонент списка чатов
  const ChatsList = () => {
    if (chatLoading && chats.length === 0) {
      return <div className="chat-list-loading">Загрузка чатов...</div>;
    }

    if (chats.length === 0) {
      return (
        <div className="no-chats">
          <p>У вас пока нет активных чатов</p>
          <Link to="/search" className="search-link">Найти собеседников</Link>
        </div>
      );
    }

    return (
      <div className="chat-list">
        {chats.map(chat => (
          <Link 
            to={`/chats/${chat.userId}`} 
            key={chat.userId} 
            className={`chat-item ${userId === chat.userId ? 'active' : ''}`}
          >
            <div className="chat-avatar">
              <img 
                src={chat.profile?.avatarUrl || chat.profile?.photoUrl || "https://mir-s3-cdn-cf.behance.net/project_modules/fs/5e227329363657.55ef8df90a1ca.png"} 
                alt="User avatar"
              />
            </div>
            <div className="chat-info">
              <div className="chat-user">{chat.profile?.nickname || chat.userId}</div>
              <div className="chat-preview">{chat.lastMessage}</div>
            </div>
            <div className="chat-time">{formatDate(chat.timestamp)}</div>
          </Link>
        ))}
      </div>
    );
  };

  // Компонент пустого чата
  const EmptyChat = () => (
    <div className="empty-chat">
      <div className="empty-chat-content">
        <h3>Выберите чат из списка или создайте новый</h3>
        <p>Начните общаться с друзьями прямо сейчас!</p>
        <Link to="/search" className="search-users-btn">
          <FontAwesomeIcon icon={faSearch} /> Найти собеседников
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`telegram-layout ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2 className='ms-4'>Сообщения</h2>
          <Link to="/search" className="new-chat-btn">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </div>
        <ChatsList />
      </div>
      <div className="chat-main">
        {userId ? (
          <ChatsComponent 
            currentUserId={currentUserId} 
            selectedUserId={userId} 
            onChatUpdated={fetchChats} 
            isDarkMode={isDarkMode}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
