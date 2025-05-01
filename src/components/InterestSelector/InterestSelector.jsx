import React, { useState, useEffect } from 'react';
import api from '../../Api';
import './InterestSelector.scss';

const InterestSelector = ({ value = [], onChange, error }) => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInterests = async () => {
      setLoading(true);
      try {
        const data = await api.getAllInterests();
        if (Array.isArray(data)) {
          setInterests(data);
        } else {
          throw new Error('Неверный формат данных');
        }
      } catch (err) {
        console.error('Ошибка при загрузке интересов:', err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const handleInterestToggle = (interestId) => {
    const newValue = value.includes(interestId)
      ? value.filter(id => id !== interestId)
      : [...value, interestId];
    onChange(newValue);
  };

  const filteredInterests = interests.filter(interest =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="interest-selector__loading">Загрузка интересов...</div>;
  if (fetchError) return <div className="interest-selector__error">{fetchError}</div>;

  return (
    <div className="interest-selector">
      <input
        type="text"
        placeholder="Поиск интересов..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="interest-selector__search"
      />
      <div className="interest-selector__list">
        {filteredInterests.map((interest) => (
          <div
            key={interest.id}
            className={`interest-selector__item ${value.includes(interest.id) ? 'selected' : ''}`}
            onClick={() => handleInterestToggle(interest.id)}
          >
            {interest.name}
          </div>
        ))}
      </div>
      {error && <div className="interest-selector__error-text">{error}</div>}
    </div>
  );
};

export default InterestSelector; 