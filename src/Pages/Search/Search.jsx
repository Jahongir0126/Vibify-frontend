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
    specialty: '',
    interests: []
  });

  useEffect(() => {
    fetchProfilesData();
  }, []);

  async function fetchProfilesData() {
    try {
      setLoading(true);
      const data = await api.getAllProfiles();
      if (data) {
        // Для каждого профиля получаем его интересы и специальность
        const profilesWithDetails = await Promise.all(
          data.map(async (profile) => {
            const [interests, specialty] = await Promise.all([
              api.getUserInterests(profile.userId),
              api.getUserSpecialty(profile.userId).catch(() => null)
            ]);
            return {
              ...profile,
              interests: Array.isArray(interests) ? interests : [],
              specialty
            };
          })
        );
        setProfiles(profilesWithDetails);
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
    
    if (currentUserId === likedId) {
      showToast.warning('Нельзя поставить лайк самому себе');
      return;
    }
    
    try {
      const likeExists = await api.checkLike(currentUserId, likedId);
      
      if (likeExists) {
        showToast.info('Вы уже поставили лайк этому пользователю');
        return;
      }
      
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
    if (currentUserId && user.userId === currentUserId) {
      return false;
    }
    
    if (filters.preferred_gender && user.gender !== filters.preferred_gender) {
      return false;
    }

    if (filters.age_min || filters.age_max) {
      const birthDate = new Date(user.birthdate);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      
      if (filters.age_min && age < parseInt(filters.age_min)) {
        return false;
      }
      if (filters.age_max && age > parseInt(filters.age_max)) {
        return false;
      }
    }

    if (filters.location_radius && user.distance > parseInt(filters.location_radius)) {
      return false;
    }

    if (filters.specialty && (!user.specialty || user.specialty.id !== filters.specialty)) {
      return false;
    }

    if (filters.interests && filters.interests.length > 0) {
      const userInterestIds = user.interests.map(interest => 
        interest.interest ? interest.interest.id : interest.id
      );
      return filters.interests.every(id => userInterestIds.includes(id));
    }

    return true;
  });
  
  return (
    <div className="search-page">
      <div className="search-filters">
        <Filters
          filters={filters}
          onChange={handleFilterChange}
        />
      </div>
      <div className="search-results">
        {loading ? (
          <div className="loading-indicator">Загрузка профилей...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-users-found">
            <p>Не найдено пользователей, соответствующих фильтрам</p>
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
    </div>
  );
};

export default Search;
