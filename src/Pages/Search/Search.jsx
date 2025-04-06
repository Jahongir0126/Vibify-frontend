import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Filters from '../../components/Filters/Filters';
import UserCard from '../../components/UserCard/UserCard';
import './Search.scss';

const mockUsers = [
  {
    id: "1",
    name: "Анна",
    age: 25,
    gender: "female",
    location: "Москва",
    distance: 2,
    photo: "https://i.pravatar.cc/300?img=19",
    interests: ['🎨 Искусство', '✈️ Путешествия', '🎵 Музыка']
  },
  {
    id: '2',
    name: 'Михаил',
    age: 28,
    gender: 'male',
    location: 'Санкт-Петербург',
    distance: 15,
    photo: 'https://i.pravatar.cc/300?img=12',
    interests: ['🎨 Искусство', '✈️ Путешествия', '🎵 Музыка']
  },
  {
    id: '3',
    name: 'Елена',
    age: 23,
    gender: 'female',
    location: 'Казань',
    distance: 8,
    photo: 'https://i.pravatar.cc/300?img=9',
    interests: ['📚 Книги', '🎮 Игры', '🌍 Путешествия']
  }
];

const Search = ({ isLoggedIn, isDarkMode, onThemeToggle, onLogout }) => {
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

  const handleLike = (userId) => {
    console.log('Liked user:', userId);
  };

  const handleSkip = (userId) => {
    console.log('Skipped user:', userId);
  };

  const filteredUsers = mockUsers.filter(user => {
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
    <Layout
      isLoggedIn={isLoggedIn}
      isDarkMode={isDarkMode}
      onThemeToggle={onThemeToggle}
      onLogout={onLogout}
    >
      <div className="search-content">
        <Filters 
          filters={filters}
          onChange={handleFilterChange}
        />
        <div className="users-grid">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onLike={handleLike}
              onSkip={handleSkip}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
