import React, { useState, useEffect } from 'react';
import './UserStats.scss';

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Здесь будет запрос к API для получения статистики
    const fetchStats = async () => {
      try {
        // Временные данные для демонстрации
        setStats({
          totalChallenges: 25,
          completedChallenges: 18,
          successRate: 72,
          averageScore: 85,
          totalPoints: 1250,
          rank: 'Эксперт'
        });
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    };

    fetchStats();
  }, [userId]);

  if (!stats) {
    return <div className="user-stats loading">Загрузка статистики...</div>;
  }

  return (
    <div className="user-stats">
      <h3>Статистика</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalChallenges}</div>
          <div className="stat-label">Всего челленджей</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedChallenges}</div>
          <div className="stat-label">Завершено</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.successRate}%</div>
          <div className="stat-label">Успешность</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageScore}</div>
          <div className="stat-label">Средний балл</div>
        </div>
      </div>

      <div className="rank-section">
        <h3>Ваш ранг</h3>
        <div className="rank-card">
          <div className="rank-icon">🏅</div>
          <div className="rank-info">
            <div className="rank-value">{stats.rank}</div>
            <div className="rank-points">{stats.totalPoints} очков</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats; 