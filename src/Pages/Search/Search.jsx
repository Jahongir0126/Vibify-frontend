import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters/Filters';
import UserCard from '../../components/UserCard/UserCard';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import api from '../../Api';
import './Search.scss';

const Search = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getUserIdFromToken();
  
  const [filters, setFilters] = useState({
    preferred_gender: '',
    age_min: '',
    age_max: '',
    location_radius: ''
  });

  useEffect(() => {
    fetchProfilesData();
  }, []);

  async function fetchProfilesData() {
    try {
      setLoading(true);
      const data = await api.getAllProfiles();
      if (data) {
        setProfiles(data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке профилей:', error);
      showToast.error('Не удалось загрузить профили пользователей');
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLike = async (likedId) => {
    if (!currentUserId) {
      showToast.error('Пользователь не авторизован');
      return;
    }
    
    // Предотвращаем лайк самому себе
    if (currentUserId === likedId) {
      showToast.warning('Нельзя поставить лайк самому себе');
      return;
    }
    
    try {
      // Сначала проверяем, существует ли уже лайк
      const likeExists = await api.checkLike(currentUserId, likedId);
      
      if (likeExists) {
        showToast.info('Вы уже поставили лайк этому пользователю');
        return;
      }
      
      // Если лайк не существует, создаем его
      const result = await api.createLike(currentUserId, likedId);
      
      if (result) {
        showToast.success('Лайк успешно добавлен');
      }
    } catch (error) {
      console.error('Ошибка при обработке лайка:', error);
      showToast.error('Не удалось поставить лайк');
    }
  };

  const handleSkip = (userId) => {
    // Можно добавить логику для пропуска пользователя
  };

  const filteredUsers = profiles.filter(user => {
    // Исключаем собственный профиль
    if (currentUserId && user.userId === currentUserId) {
      return false;
    }
    
    // Применяем остальные фильтры
    if (filters.preferred_gender && user.gender !== filters.preferred_gender) {
      return false;
    }
    if (filters.age_min && user.age < parseInt(filters.age_min)) {
      return false;
    }
    if (filters.age_max && user.age > parseInt(filters.age_max)) {
      return false;
    }
    if (filters.location_radius && user.distance > parseInt(filters.location_radius)) {
      return false;
    }
    return true;
  });
  
  return (
    <div className="search-content">
      <Filters
        filters={filters}
        onChange={handleFilterChange}
      />
      {loading ? (
        <div className="loading-indicator">Загрузка профилей...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users-found">
          Не найдено пользователей, соответствующих фильтрам
        </div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map(user => (
            <UserCard
              key={user.userId}
              user={user}
              onLike={handleLike}
              onSkip={handleSkip}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
