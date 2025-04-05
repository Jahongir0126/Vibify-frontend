import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Hero from '../../components/Hero/Hero';
import Filters from '../../components/Filters/Filters';
import UserCard from '../../components/UserCard/UserCard';
import Footer from '../../components/Footer/Footer';
import './HomePage.scss';

// Временные данные для демонстрации
const mockUsers = [
  {
    id: '1',
    name: 'Анна',
    photo: 'https://source.unsplash.com/random/400x500?portrait=1',
    interests: ['🎲 Квесты', '📖 Ницше', '🌸 Япония'],
  },
  {
    id: '2',
    name: 'Михаил',
    photo: 'https://source.unsplash.com/random/400x500?portrait=2',
    interests: ['🎨 Искусство', '✈️ Путешествия', '🎵 Джаз'],
  },
  {
    id: '3',
    name: 'Елена',
    photo: 'https://source.unsplash.com/random/400x500?portrait=3',
    interests: ['📚 Книги', '🎮 Геймер', '🌍 Путешествия'],
  },
];

const HomePage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Здесь будет логика фильтрации пользователей
  };

  const handleLike = (userId: string) => {
    console.log('Liked user:', userId);
    // Здесь будет логика обработки лайка
  };

  const handleSkip = (userId: string) => {
    console.log('Skipped user:', userId);
    // Здесь будет логика обработки пропуска
  };

  return (
    <div className={`home-page ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar />
      <main className="main-content">
        <Hero />
        <div className="users-section">
          <Filters onFilterChange={handleFilterChange} />
          <div className="users-grid">
            {mockUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onLike={handleLike}
                onSkip={handleSkip}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer 
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
};

export default HomePage; 