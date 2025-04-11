import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import './UserCard.scss';

const UserCard = ({ user, onLike, onSkip }) => {
  return (
    <div className="user-card">
      <div className="user-card-image">
        <img src={user.photoUrl} alt="user_image" />
      </div>
      <div className="user-card-content">
        <h3 className="user-card-name">{user.bio || 'Нет информации'}</h3>
        <div className="user-card-details">
          <p><strong>Город:</strong> {user.location || 'Не указан'}</p>
          <p><strong>Пол:</strong> {user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Другой'}</p>
          {user.birthdate && (
            <p><strong>Дата рождения:</strong> {new Date(user.birthdate).toLocaleDateString()}</p>
          )}
        </div>
        <div className="user-card-interests">
          {user.interests && user.interests.map((interest, index) => (
            <span key={index} className="interest-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="user-card-actions">
        <button 
          className="action-button skip"
          onClick={() => onSkip(user.userId)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button 
          className="action-button like"
          onClick={() => onLike(user.userId)}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
    </div>
  );
};

export default UserCard; 