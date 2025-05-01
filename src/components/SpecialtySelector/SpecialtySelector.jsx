import React, { useState, useEffect } from 'react';
import './SpecialtySelector.scss';

const SpecialtySelector = ({ value, onChange, error }) => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/specialties');
        if (!response.ok) throw new Error('Ошибка загрузки специальностей');
        const data = await response.json();
        setSpecialties(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  if (loading) return <div className="specialty-selector__loading">Загрузка специальностей...</div>;
  if (fetchError) return <div className="specialty-selector__error">{fetchError}</div>;

  return (
    <div className="specialty-selector">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'error' : ''}
      >
        <option value="">Выберите специальность</option>
        {specialties.map((specialty) => (
          <option key={specialty.id} value={specialty.id}>
            {specialty.name}
          </option>
        ))}
      </select>
      {error && <div className="specialty-selector__error-text">{error}</div>}
    </div>
  );
};

export default SpecialtySelector; 