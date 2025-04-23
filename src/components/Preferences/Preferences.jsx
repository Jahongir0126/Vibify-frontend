import React, { useState, useEffect } from 'react';
import api from '../../Api';
import { toast } from 'react-toastify';
import './Preferences.scss';
import { showToast } from '../../utils/toast';

const Preferences = () => {
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

  // Получаем userId из токена
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.id || payload.userId;
    } catch (err) {
      console.error('Ошибка при получении ID пользователя:', err);
      return null;
    }
  };

  const fetchPreferences = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setError('Необходима авторизация');
      setLoading(false);
      return;
    }

    try {
      const response = await api.getPreferencesById(userId);
      if (response && !response.message) {
        setPreferences(response);
        setFormData({
          preferredGender: response.preferredGender || '',
          ageMin: response.ageMin || 18,
          ageMax: response.ageMax || 35,
          locationRadius: response.locationRadius || 50,
          chatTheme: response.chatTheme || 'default'
        });
        setIsEditing(false);
      } else {
        setPreferences(null);
        setIsEditing(true);
      }
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setPreferences(null);
        setIsEditing(true);
        setLoading(false);
      } else {
        setError('Ошибка при загрузке предпочтений');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

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

  useEffect(() => {
    if (formData.chatTheme) {
      applyThemeColors(formData.chatTheme);
    }
  }, [formData.chatTheme]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const userId = getUserIdFromToken();
    if (!userId) {
      setError('Необходима авторизация');
      return;
    }

    try {
      const preferenceData = {
        ...formData,
        userId
      };

      let response;

      if (preferences?.id) {
        response = await api.updatePreferences(preferences.id, preferenceData);
        // console.log(response);

      } else {
        response = await api.createPreferences(preferenceData);
        // console.log(response);

      }

      // Проверяем успешность ответа
      if (response && !response.message) {
        // Обновляем состояние
        setPreferences(response);
        setIsEditing(false);
        setError(null);
        applyThemeColors(formData.chatTheme);

        // Показываем уведомление об успехе
        showToast.success(preferences?.id ? 'Настройки успешно обновлены' : 'Настройки успешно созданы');
      } else {
        // В случае ошибки в ответе
        setError('Ошибка при сохранении предпочтений');
        showToast.error('Ошибка при сохранении настроек');
      }
    } catch (err) {
      // В случае ошибки запроса
      setError('Ошибка при сохранении предпочтений');
      showToast.error('Ошибка при сохранении настроек',)
    }
  };

  const handleDelete = async () => {
    if (!preferences?.id) {
      return;
    }

    if (window.confirm('Вы уверены, что хотите удалить предпочтения?')) {
      try {
        await api.deletePreferences(preferences.id);
        showToast.success('Настройки успешно удалены',{
          onClose: () => {
            setPreferences(null);
            setIsEditing(true);
            setFormData({
              preferredGender: '',
              ageMin: 18,
              ageMax: 35,
              locationRadius: 50,
              chatTheme: 'default'
            });
          }
        });
      } catch (err) {
        showToast.error('Ошибка при удалении настроек')
        setError('Ошибка при удалении предпочтений');
      }
    }
  };

  if (loading) {
    return <div className="preferences-loading">Загрузка...</div>;
  }

  return (
    <div className="preferences">
      <div className="preferences-header">
        <h2>{preferences ? 'Настройки поиска' : 'Создание настроек поиска'}</h2>
        {preferences && (
          <div className="preferences-actions ms-5">
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Отменить' : 'Редактировать'}
            </button>
            <button onClick={handleDelete} className="delete-button">
              Удалить
            </button>
          </div>
        )}
      </div>

      {error && <div className="preferences-error">{error}</div>}

      {(isEditing || !preferences) ? (
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
            {preferences ? 'Сохранить изменения' : 'Создать настройки'}
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
                background: `linear-gradient(135deg, ${chatThemeOptions.find(t => t.id === (preferences?.chatTheme || 'default'))?.primary || '#6c5ce7'
                  } 0%, ${chatThemeOptions.find(t => t.id === (preferences?.chatTheme || 'default'))?.secondary || '#fd79a8'
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