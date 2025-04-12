import React, { useState, useEffect } from 'react';
import api from '../../Api';
import './Preferences.scss';

const Preferences = ({ userId }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    preferredGender: '',
    ageMin: 18,
    ageMax: 35,
    locationRadius: 50,
    chatTheme: 'default'
  });

  // Доступные цветовые схемы для чата
  const chatThemeOptions = [
    { id: 'default', name: 'Стандартная', primary: '#6c5ce7', secondary: '#fd79a8' },
    { id: 'blue', name: 'Синяя', primary: '#0984e3', secondary: '#00cec9' },
    { id: 'green', name: 'Зеленая', primary: '#00b894', secondary: '#55efc4' },
    { id: 'orange', name: 'Оранжевая', primary: '#e17055', secondary: '#fdcb6e' },
    { id: 'dark', name: 'Темная', primary: '#2d3436', secondary: '#636e72' }
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await api.getPreferencesById(userId);
        if (response) {
          setPreferences(response);
          setFormData({
            preferredGender: response.preferredGender || '',
            ageMin: response.ageMin || 18,
            ageMax: response.ageMax || 35,
            locationRadius: response.locationRadius || 50,
            chatTheme: response.chatTheme || 'default'
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке предпочтений');
        setLoading(false);
      }
    };

    if (userId) {
      fetchPreferences();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preferredGender' || name === 'chatTheme' ? value : parseInt(value)
    }));
  };

  // Применить цветовую схему
  const applyThemeColors = (themeId) => {
    const selectedTheme = chatThemeOptions.find(theme => theme.id === themeId);
    if (selectedTheme) {
      document.documentElement.style.setProperty('--accent-primary', selectedTheme.primary);
      document.documentElement.style.setProperty('--accent-secondary', selectedTheme.secondary);
    }
  };

  // Применяем цвета при изменении темы
  useEffect(() => {
    if (formData.chatTheme) {
      applyThemeColors(formData.chatTheme);
    }
  }, [formData.chatTheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.updatePreferences(userId, {
        ...formData,
        userId
      });
      if (response) {
        setPreferences(response);
        setIsEditing(false);
        
        // Применяем цветовую схему при сохранении
        applyThemeColors(formData.chatTheme);
      }
    } catch (err) {
      setError('Ошибка при обновлении предпочтений');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить предпочтения?')) {
      try {
        await api.deletePreferences(userId);
        setPreferences(null);
        setIsEditing(true);
      } catch (err) {
        setError('Ошибка при удалении предпочтений');
      }
    }
  };

  // if (loading) return <div className="preferences loading">Загрузка предпочтений...</div>;
  if (error) return <div className="preferences error">{error}</div>;

  return (
    <div className="preferences">
      <div className="preferences-header">
        <h2>Предпочтения</h2>
        <div className="preferences-actions">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Отменить' : 'Редактировать'}
          </button>
          {preferences && (
            <button onClick={handleDelete} className="delete-button">
              Удалить
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form className="preferences-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Предпочитаемый пол</label>
            <select
              name="preferredGender"
              value={formData.preferredGender}
              onChange={handleInputChange}
            >
              <option value="">Не важно</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>

          <div className="form-group">
            <label>Минимальный возраст</label>
            <input
              type="number"
              name="ageMin"
              value={formData.ageMin}
              onChange={handleInputChange}
              min="18"
              max={formData.ageMax}
            />
          </div>

          <div className="form-group">
            <label>Максимальный возраст</label>
            <input
              type="number"
              name="ageMax"
              value={formData.ageMax}
              onChange={handleInputChange}
              min={formData.ageMin}
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Радиус поиска (км)</label>
            <input
              type="number"
              name="locationRadius"
              value={formData.locationRadius}
              onChange={handleInputChange}
              min="1"
              max="1000"
            />
          </div>

          <div className="form-group theme-selection">
            <label>Цветовая схема чата</label>
            <div className="theme-options">
              {chatThemeOptions.map(theme => (
                <div 
                  key={theme.id} 
                  className={`theme-option ${formData.chatTheme === theme.id ? 'selected' : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'chatTheme', value: theme.id } })}
                >
                  <div 
                    className="theme-color-preview" 
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` 
                    }} 
                  />
                  <span>{theme.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="save-button">
            Сохранить изменения
          </button>
        </form>
      ) : (
        <div className="preferences-info">
          <div className="info-group">
            <h3>Предпочитаемый пол</h3>
            <p>{preferences?.preferredGender ? (preferences.preferredGender === 'male' ? 'Мужской' : 'Женский') : 'Не важно'}</p>
          </div>
          <div className="info-group">
            <h3>Возрастной диапазон</h3>
            <p>{preferences?.ageMin} - {preferences?.ageMax} лет</p>
          </div>
          <div className="info-group">
            <h3>Радиус поиска</h3>
            <p>{preferences?.locationRadius} км</p>
          </div>
          <div className="info-group">
            <h3>Цветовая схема чата</h3>
            <div className="theme-preview">
              <div className="theme-color-preview" style={{ 
                background: `linear-gradient(135deg, ${
                  chatThemeOptions.find(t => t.id === (preferences?.chatTheme || 'default'))?.primary || '#6c5ce7'
                } 0%, ${
                  chatThemeOptions.find(t => t.id === (preferences?.chatTheme || 'default'))?.secondary || '#fd79a8'
                } 100%)` 
              }} />
              <span>{chatThemeOptions.find(t => t.id === (preferences?.chatTheme || 'default'))?.name || 'Стандартная'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preferences; 