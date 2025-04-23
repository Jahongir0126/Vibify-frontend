import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../Api';
import './CreateProfile.scss';
import { toast } from 'react-toastify';
import { showToast } from '../../utils/toast';

const CreateProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    gender: '',
    birthdate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        userId: currentUser.id,
        ...formData
      };
      const response = await api.createProfile(profileData);
      if (response) {
        showToast.success('Профиль успешно создан!');
        navigate('/profile'); // Перенаправляем на страницу профиля
      }
    } catch (error) {
      showToast.error('Ошибка при создании профиля:'+ error.message);
    }
  };

  return (
    <div className="create-profile">
      <h2>Создание профиля</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bio">О себе:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Расскажите о себе"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Местоположение:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Ваш город"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Пол:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Выберите пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="birthdate">Дата рождения:</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Создать профиль
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile; 