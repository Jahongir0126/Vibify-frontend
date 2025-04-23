import React from 'react';
import './ChallengeHeader.scss';

const ChallengeHeader = ({ theme = 'light' }) => {
  return (
    <div className={`challenges-header ${theme}`}>
      <h1>Челленджи</h1>
      
      <div className="user-stats">
        <div className="user-level">
          <i className="fas fa-gem gem-icon" />
          <span>Уровень 42</span>
        </div>
        
        <div className="user-badges">
          <i className="fas fa-medal badge-mini" title="Медаль" />
          <i className="fas fa-trophy badge-mini" title="Трофей" />
          <i className="fas fa-crown badge-mini" title="Корона" />
        </div>
      </div>
    </div>
  );
};

export default ChallengeHeader; 