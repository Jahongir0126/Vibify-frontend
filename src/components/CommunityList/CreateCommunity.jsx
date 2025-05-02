import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTags, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import api from '../../Api';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import './CreateCommunity.scss';

const CreateCommunity = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specialtyId: '',
    interestIds: []
  });
  const [specialties, setSpecialties] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpecialtiesAndInterests();
  }, []);

  const fetchSpecialtiesAndInterests = async () => {
    try {
      const [specialtiesResponse, interestsResponse] = await Promise.all([
        api.getAllSpecialties(),
        api.getAllInterests()
      ]);

      setSpecialties(specialtiesResponse);
      setAvailableInterests(interestsResponse);
    } catch (err) {
      console.error('Ошибка при загрузке специальностей и интересов:', err);
      setError('Не удалось загрузить необходимые данные');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interestIds: prev.interestIds.includes(interestId)
        ? prev.interestIds.filter(id => id !== interestId)
        : [...prev.interestIds, interestId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
            const response = await api.createCommunity(formData);
      if (response.id) {
        showToast.success('Сообщество успешно создано');
        navigate(`/communities/${response.id}`);
      } else {
        throw new Error(response.message || 'Ошибка при создании сообщества');
      }
    } catch (err) {
      console.error('Ошибка при создании сообщества:', err);
      setError(err.message || 'Не удалось создать сообщество');
      showToast.error(err.message || 'Не удалось создать сообщество');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`create-community ${isDarkMode ? 'dark' : 'light'}`}>
      <h2>Создание нового сообщества</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Название сообщества</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название сообщества"
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите цель и тематику сообщества"
            required
            minLength={10}
            maxLength={500}
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialtyId">Специальность</label>
          <div className="specialty-select">
            <FontAwesomeIcon icon={faGraduationCap} />
            <select
              id="specialtyId"
              name="specialtyId"
              value={formData.specialtyId}
              onChange={handleChange}
              required
            >
              <option value="">Выберите специальность</option>
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Интересы</label>
          <div className="interests-grid">
            {availableInterests.map(interest => (
              <button
                type="button"
                key={interest.id}
                className={`interest-tag ${formData.interestIds.includes(interest.id) ? 'selected' : ''}`}
                onClick={() => handleInterestToggle(interest.id)}
              >
                <FontAwesomeIcon icon={faTags} />
                {interest.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/chats')}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать сообщество'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;