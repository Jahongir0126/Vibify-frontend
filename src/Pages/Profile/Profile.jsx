import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LikeButton from '../../components/LikesBtn/LikeButton';
import ProfileComponent from '../../components/Profile/ProfileComponent';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import './Profile.scss';

// Функция для декодирования JWT токена
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
};

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [displayUserId, setDisplayUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const initializeProfile = () => {
      try {
        const userIdFromToken = getUserIdFromToken();
        setCurrentUserId(userIdFromToken);
        
        if (!userIdFromToken && !userId) {
          showToast.error('Необходима авторизация');
          navigate('/login');
          return;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Ошибка при инициализации профиля:', err);
        setError('Произошла ошибка при загрузке данных.');
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, [navigate, userId]);
  
  useEffect(() => {
    // Если userId из параметров не задан, используем текущего пользователя
    if (!userId && currentUserId) {
      navigate(`/profile/${currentUserId}`);
    } else if (userId) {
      setDisplayUserId(userId);
    } else if (currentUserId) {
      setDisplayUserId(currentUserId);
    }
  }, [userId, currentUserId, navigate]);

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading-container">Загрузка профиля...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">{error}</div>
      </div>
    );
  }

  if (!displayUserId) {
    return (
      <div className="profile-page">
        <div className="error-container">Профиль не найден</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">
          {displayUserId === currentUserId ? 'Мой профиль' : 'Профиль пользователя'}
        </h1>
        {currentUserId && displayUserId !== currentUserId && (
          <LikeButton likerId={currentUserId} likedId={displayUserId} />
        )}
      </div>
      <div className="profile-content">
        <ProfileComponent userId={displayUserId} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default Profile;
