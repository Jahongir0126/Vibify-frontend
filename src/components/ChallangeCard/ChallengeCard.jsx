import React from 'react';
import './ChallengeCard.scss';

const ChallengeCard = ({ 
  title, 
  description, 
  progress, 
  reward, 
  difficulty, 
  type, 
  isLocked,
  theme = 'light'
}) => {
  return (
    <div className={`challenge-card ${type} ${theme} ${isLocked ? 'locked' : ''}`}>
      <div className="challenge-header">
        <div className="challenge-icon">
          <i className={`fas fa-${getIconByType(type)}`} />
        </div>
        <div className="difficulty-badge">{difficulty}</div>
      </div>
      
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{description}</p>
        
        <div className="progress-section">
          <div className={`progress ${type}-progress`}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
        
        <div className="reward-section">
          <p className="reward-text">{reward}</p>
          <button className="reward-button">
            Claim Reward
          </button>
        </div>
      </div>
      
      {isLocked && (
        <div className="challenge-locked">
          <i className="fas fa-lock lock-icon" />
          <p>Complete previous challenges to unlock</p>
        </div>
      )}
    </div>
  );
};

const getIconByType = (type) => {
  switch (type) {
    case 'daily':
      return 'sun';
    case 'weekly':
      return 'calendar-week';
    case 'monthly':
      return 'calendar-alt';
    case 'premium':
      return 'crown';
    default:
      return 'trophy';
  }
};

export default ChallengeCard; 