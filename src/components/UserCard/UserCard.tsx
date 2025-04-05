import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import './UserCard.scss';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    photo: string;
    interests: string[];
  };
  onLike: (id: string) => void;
  onSkip: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onLike, onSkip }) => {
  return (
    <div className="user-card">
      <div className="user-card-image">
        <img src={user.photo} alt={user.name} />
      </div>
      <div className="user-card-content">
        <h3 className="user-card-name">{user.name}</h3>
        <div className="user-card-interests">
          {user.interests.map((interest, index) => (
            <span key={index} className="interest-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="user-card-actions">
        <button 
          className="action-button skip"
          onClick={() => onSkip(user.id)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button 
          className="action-button like"
          onClick={() => onLike(user.id)}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
    </div>
  );
};

export default UserCard; 