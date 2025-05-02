import React, { useState, useEffect } from 'react';
import api from '../../Api';
import './Filters.scss';

const defaultFilters = {
  preferred_gender: '',
  age_min: '',
  age_max: '',
  specialty: '',
  interests: []
};

const Filters = ({ filters = defaultFilters, onChange }) => {
  const [specialties, setSpecialties] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [interestsData, specialtiesData] = await Promise.all([
          api.getAllInterests(),
          fetch('http://localhost:3000/specialties').then(res => res.json())
        ]);
        
        if (Array.isArray(interestsData)) {
          setAvailableInterests(interestsData);
        }
        
        if (Array.isArray(specialtiesData)) {
          setSpecialties(specialtiesData);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных для фильтров:', error);
      }
    };

    fetchFilterData();
  }, []);

  const handleInterestChange = (interestId) => {
    const currentInterests = filters.interests || [];
    const newInterests = currentInterests.includes(interestId)
      ? currentInterests.filter(id => id !== interestId)
      : [...currentInterests, interestId];
    
    onChange('interests', newInterests);
  };

  const getSelectedInterestsCount = () => {
    return filters.interests?.length || 0;
  };

  return (
    <div className="filters-section">
      <div className="filters-grid">
      <div className="filter-item">
          <label>Специальность</label>
          <select
            value={filters.specialty}
            onChange={(e) => onChange('specialty', e.target.value)}
          >
            <option value="">Любая специальность</option>
            {specialties.map(specialty => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item interests-dropdown">
          <label>Интересы</label>
          <div className="dropdown-container">
            <button 
              className="interests-button"
              onClick={() => setIsInterestsOpen(!isInterestsOpen)}
            >
              {getSelectedInterestsCount() > 0 
                ? `Выбрано: ${getSelectedInterestsCount()}`
                : 'Выберите интересы'}
            </button>
            {isInterestsOpen && (
              <div className="interests-dropdown-content">
                {availableInterests.map(interest => (
                  <label key={interest.id} className="interest-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.interests?.includes(interest.id)}
                      onChange={() => handleInterestChange(interest.id)}
                    />
                    <span className="checkbox-custom"></span>
                    {interest.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="filter-item">
          <label>Пол</label>
          <select
            value={filters.preferred_gender}
            onChange={(e) => onChange('preferred_gender', e.target.value)}
          >
            <option value="">Любой пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Возраст</label>
          <div className="age-inputs">
            <input
              type="number"
              placeholder="От"
              value={filters.age_min}
              onChange={(e) => onChange('age_min', e.target.value)}
              min="18"
              max="100"
            />
            <span className="age-separator">-</span>
            <input
              type="number"
              placeholder="До"
              value={filters.age_max}
              onChange={(e) => onChange('age_max', e.target.value)}
              min="18"
              max="100"
            />
          </div>
        </div>


        
      </div>
    </div>
  );
};

export default Filters;