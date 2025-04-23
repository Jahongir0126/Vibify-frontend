import React from 'react';
import './ChallengeTabs.scss';

const ChallengeTabs = ({ activeTab, onTabChange, theme = 'light' }) => {
  const tabs = [
    { id: 'daily', label: 'Ежедневные' },
    { id: 'weekly', label: 'Еженедельные' },
    { id: 'monthly', label: 'Ежемесячные' },
    { id: 'premium', label: 'Премиум' }
  ];

  return (
    <div className={`challenge-tabs ${theme}`}>
      {tabs.map(tab => (
        <div key={tab.id} className="nav-item">
          <button
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChallengeTabs; 