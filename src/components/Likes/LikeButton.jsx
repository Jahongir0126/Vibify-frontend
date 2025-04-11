import React, { useState, useEffect } from 'react';
import api from '../../Api';
import './LikeButton.scss';

const LikeButton = ({ likerId, likedId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await api.checkLike(likerId, likedId);
        if (response) {
          setIsLiked(response.isLiked);
          setLikeId(response.likeId);
        }
        setLoading(false);
      } catch (err) {
        setError('Ошибка при проверке лайка');
        setLoading(false);
      }
    };

    if (likerId && likedId) {
      checkLikeStatus();
    }
  }, [likerId, likedId]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.deleteLike(likeId);
        setIsLiked(false);
        setLikeId(null);
      } else {
        const response = await api.createLike(likerId, likedId);
        if (response) {
          setIsLiked(true);
          setLikeId(response.id);
        }
      }
    } catch (err) {
      setError('Ошибка при обработке лайка');
    }
  };

  if (loading) return <div className="like-button loading">...</div>;
  if (error) return <div className="like-button error">{error}</div>;

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''}`}
      onClick={handleLike}
      disabled={loading}
    >
      <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
      <span className="like-text">{isLiked ? 'Убрать лайк' : 'Лайкнуть'}</span>
    </button>
  );
};

export default LikeButton; 