import React from 'react';
import './Filters.scss';

const defaultFilters = {
  preferred_gender: '',
  age_min: '',
  age_max: '',
  location_radius: ''
};

const Filters = ({ filters = defaultFilters, onChange }) => {
  return (
    <div className="filters-section">
      <div className="filters-container">
        <div className="filter-item">
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
          <input
            type="number"
            placeholder="Мин. возраст"
            value={filters.age_min}
            onChange={(e) => onChange('age_min', e.target.value)}
            min="18"
            max="100"
          />
        </div>

        <div className="filter-item">
          <input
            type="number"
            placeholder="Макс. возраст"
            value={filters.age_max}
            onChange={(e) => onChange('age_max', e.target.value)}
            min="18"
            max="100"
          />
        </div>

        <div className="filter-item">
          <input
            type="number"
            placeholder="Радиус поиска (км)"
            value={filters.location_radius}
            onChange={(e) => onChange('location_radius', e.target.value)}
            min="1"
            max="1000"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters; 