import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import CommunityChat from '../../components/CommunityChat/CommunityChat';
import api from '../../Api';
import './CommunityChatPage.scss';

const CommunityChatPage = ({ isDarkMode }) => {
  const { id: communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const loadData = async () => {
      if (!currentUserId) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        // Получаем только необходимую информацию о сообществе
        const communityData = await api.getCommunityById(communityId);
        if (!communityData) {
          throw new Error('Сообщество не найдено');
        }
        // Сохраняем только название и описание
        setCommunity({
          name: communityData.name,
          description: communityData.description
        });

        // Проверяем, является ли пользователь участником сообщества
        const userCommunities = await api.getUserCommunities(currentUserId);
        const isMemberOfCommunity = userCommunities.some(c => c.id === communityId);
        setIsMember(isMemberOfCommunity);

        if (!isMemberOfCommunity) {
          navigate(`/communities/${communityId}`);
          showToast.warning('Вы должны быть участником сообщества, чтобы видеть чат');
        }

        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError(err.message || 'Ошибка при загрузке данных');
        setLoading(false);
      }
    };

    loadData();
  }, [communityId, currentUserId, navigate]);

  if (!currentUserId) {
    return (
      <div className={`community-chat-error ${isDarkMode ? 'dark' : 'light'}`}>
        Необходимо войти в систему
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`community-chat-loading ${isDarkMode ? 'dark' : 'light'}`}>
        Загрузка чата...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`community-chat-error ${isDarkMode ? 'dark' : 'light'}`}>
        {error}
      </div>
    );
  }

  if (!isMember) {
    return null; // Редирект уже выполнен в useEffect
  }

  return (
    <div className={`community-chat-page ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="community-chat-header d-flex">
        <h1>{community?.name || 'Чат сообщества'}</h1>
        {community?.description && <p className='ms-5'>{community.description}</p>}
      </div>

      <CommunityChat
        currentUserId={currentUserId}
        selectedUserId={communityId}
        isDarkMode={isDarkMode}
        isCommunityChat={true}
      />
    </div>
  );
};

export default CommunityChatPage;