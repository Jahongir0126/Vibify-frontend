import React, { useState } from 'react';
import './Filters.scss';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  interests: string[];
  location: string;
  ageRange: [number, number];
  relationshipType: string;
  accessibility: string[];
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    interests: [],
    location: '',
    ageRange: [18, 99],
    relationshipType: 'all',
    accessibility: [],
  });

  const handleChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Интересы</label>
        <select 
          multiple 
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            handleChange('interests', values);
          }}
        >
          <option value="quests">🎲 Квесты</option>
          <option value="philosophy">📖 Философия</option>
          <option value="travel">✈️ Путешествия</option>
          <option value="art">🎨 Искусство</option>
          <option value="music">🎵 Музыка</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Локация</label>
        <input 
          type="text" 
          placeholder="Введите город"
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Возраст</label>
        <div className="range-inputs">
          <input 
            type="number" 
            min="18" 
            max="99"
            value={filters.ageRange[0]}
            onChange={(e) => handleChange('ageRange', [parseInt(e.target.value), filters.ageRange[1]])}
          />
          <span>-</span>
          <input 
            type="number" 
            min="18" 
            max="99"
            value={filters.ageRange[1]}
            onChange={(e) => handleChange('ageRange', [filters.ageRange[0], parseInt(e.target.value)])}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Тип знакомства</label>
        <select 
          onChange={(e) => handleChange('relationshipType', e.target.value)}
        >
          <option value="all">Все</option>
          <option value="friends">Друзья</option>
          <option value="partners">Партнеры</option>
          <option value="travel">Путешествия</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Адаптивность</label>
        <select 
          multiple
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            handleChange('accessibility', values);
          }}
        >
          <option value="screen-reader">Поддержка скринридера</option>
          <option value="high-contrast">Высокий контраст</option>
          <option value="keyboard">Управление с клавиатуры</option>
        </select>
      </div>
    </div>
  );
};

export default Filters; 