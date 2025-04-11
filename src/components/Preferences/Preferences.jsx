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
    locationRadius: 50
  });

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
            locationRadius: response.locationRadius || 50
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
      [name]: name === 'preferredGender' ? value : parseInt(value)
    }));
  };

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

  if (loading) return <div className="preferences loading">Загрузка предпочтений...</div>;
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
        </div>
      )}
    </div>
  );
};

export default Preferences; 