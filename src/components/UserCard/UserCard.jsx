import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes, faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './UserCard.scss';

const UserCard = ({ user, onLike, onSkip }) => {
  return (
    <div className="user-card">
      <Link to={`/profile/${user.userId}`}>
      <div className="user-card-image">
        <img src={user.photoUrl} alt="user_image" />
      </div>
      <div className="user-card-content">
          <h3 className='iser-card-name'>{user.nickname || 'Не указан'}</h3>
        <div className="user-card-details">
          <p><strong>Био:</strong> {user.bio || 'Не указан'}</p>
          <p><strong>Город:</strong> {user.location || 'Не указан'}</p>
          <p><strong>Пол:</strong> {user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Другой'}</p>
          {user.birthdate && (
            <p><strong>Дата рождения:</strong> {new Date(user.birthdate).toLocaleDateString()}</p>
          )}
          {user.specialty && (
            <p><strong>Специальность:</strong> {user.specialty.name}</p>
          )}
        </div>
        {user.interests && user.interests.length > 0 && (
          <div className="user-card-interests">
            <p><strong>Интересы:</strong></p>
            <div className="interests-tags">
              {user.interests.map((interestItem, index) => (
                <span key={index} className="interest-tag">
                  {interestItem.interest ? interestItem.interest.name : interestItem.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div></Link>
      <div className="user-card-actions">
        <button 
          className="action-button skip"
          onClick={() => onSkip(user.userId)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <Link 
          to={`/chats/${user.userId}`}
          className="action-button chat"
        >
          <FontAwesomeIcon icon={faComment} />
        </Link>
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