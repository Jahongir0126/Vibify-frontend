import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters/Filters';
import UserCard from '../../components/UserCard/UserCard';
import './Search.scss';
import api from '../../Api';


const Search = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfilesData()
  }, []);

  async function fetchProfilesData() {
    await api.getAllProfiles().then(data => {
      setProfiles(data);
    });
  }
  const [filters, setFilters] = useState({
    preferred_gender: '',
    age_min: '',
    age_max: '',
    location_radius: ''
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLike = (likedId) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('Пользователь не авторизован');
      return;
    }
    
    try {
      // Получение ID из токена (если токен содержит ID пользователя)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const likerId = payload.id || payload.userId; // ID может быть под разными ключами
      
      if (!likerId) {
        console.error('ID пользователя не найден в токене');
        return;
      }
      
      // Предотвращаем лайк самому себе
      if (likerId === likedId) {
        console.warn('Нельзя поставить лайк самому себе');
        return;
      }
      
      // Сначала проверяем, существует ли уже лайк
      fetch('http://localhost:3000/likes/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          likerId, 
          likedId 
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка при проверке лайка: ${response.status}`);
        }
        return response.text().then(text => {
          return text ? JSON.parse(text) : false;
        });
      })
      .then(exists => {
        if (exists) {
          console.log('Лайк уже существует');
          return;
        }
        
        console.log('Отправка нового лайка:', { likerId, likedId });
        
        // Если лайк не существует, создаем его
        return fetch('http://localhost:3000/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            likerId, 
            likedId 
          }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Ошибка при добавлении лайка: ${response.status}`);
          }
          // Проверяем, содержит ли ответ какой-либо текст
          return response.text().then(text => {
            return text ? JSON.parse(text) : { success: true };
          });
        })
        .then(data => {
          console.log('Лайк успешно добавлен:', data);
        });
      })
      .catch(error => {
        console.error('Ошибка при обработке лайка:', error.message);
      });
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
    }
  };

  const handleSkip = (userId) => {
    console.log('Skipped user:', userId);
  };

  // Получаем ID текущего пользователя из токена
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.id || payload.userId;
    } catch (error) {
      console.error('Ошибка при получении ID пользователя:', error);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

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
    </div>
  );
};

export default Search;
