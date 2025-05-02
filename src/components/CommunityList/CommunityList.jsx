import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import api from '../../Api';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import './CommunityList.scss';

const CommunityList = ({ isDarkMode }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userIdFromToken = getUserIdFromToken();
    setCurrentUserId(userIdFromToken);
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.getAllCommunities();
      setCommunities(response);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке сообществ:', err);
      setError('Не удалось загрузить сообщества');
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      if (!currentUserId) {
        showToast.error('Необходима авторизация');
        return;
      }
      const response = await api.joinCommunity(currentUserId, communityId);
        showToast.success('Вы присоединились к сообществу');
        fetchCommunities(); // Обновляем список сообществ
    } catch (err) {
      console.error('Ошибка при присоединении к сообществу:', err);
      showToast.error('Не удалось присоединиться к сообществу');
    }
  };

  if (loading) {
    return <div className="community-list-loading">Загрузка сообществ...</div>;
  }

  if (error) {
    return <div className="community-list-error">{error}</div>;
  }

  return (
    <div className={`community-list ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="community-header">
        <h2 className='me-4'>Сообщества</h2>
        <Link to="/communities/create" className="create-community-btn">
          <FontAwesomeIcon icon={faPlus} />
          <span>Создать сообщество</span>
        </Link>
      </div>

      {communities.length === 0 ? (
        <div className="no-communities">
          <FontAwesomeIcon icon={faUsers} size="2x" />
          <p>Нет доступных сообществ</p>
          <Link to="/communities/create" className="create-first-community-btn">
            Создать первое сообщество
          </Link>
        </div>
      ) : (
        <div className="communities-grid ">
          {communities.map(community => (
            <div key={community.id} className="community-card">
              <div className="community-info">
                <h3>{community.name}</h3>
                <p>{community.description}</p>
                <div className="community-meta">
                  <span className="members-count">
                    <FontAwesomeIcon icon={faUsers} />
                    {community.members?.length || 0} участников
                  </span>
                </div>
              </div>
              <div className="community-actions">
                <Link 
                  to={`/community/${community.id}/chat`} 
                  className="join-community-btn"
                >
                  Чат 
                </Link>
                <Link 
                  to={`/communities/${community.id}`} 
                  className="view-community-btn"
                >
                  Просмотреть
                </Link>
                {!community.members?.some(member => member.userId === currentUserId) && (
                  <button
                    onClick={() => handleJoinCommunity(community.id)}
                    className="join-community-btn"
                  >
                    Присоединиться
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityList;