import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/auth';
import api from '../../Api';
import './MyLikes.scss';

const MyLikes = ({ isDarkMode }) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchLikes = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getUserLikes(currentUserId);
        if (response && Array.isArray(response)) {
          setLikes(response);
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [currentUserId]);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleUnlike = async (likeId) => {
    try {
      await api.deleteLike(likeId);
      setLikes(likes.filter(like => like.id !== likeId));
    } catch (error) {
      console.error('Error removing like:', error);
    }
  };

  if (!currentUserId) {
    return (
      <div className={`my-likes-page ${isDarkMode ? 'dark' : 'light'}`}>
        <Container>
          <div className="text-center">Пожалуйста, войдите в систему</div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`my-likes-page ${isDarkMode ? 'dark' : 'light'}`}>
      <Container>
        <h1 className="text-center mb-4">Мои лайки</h1>
        {loading ? (
          <div className="text-center">Загрузка...</div>
        ) : likes.length === 0 ? (
          <div className="text-center">Вы пока никому не поставили лайк</div>
        ) : (
          <Row>
            {likes.map((like) => (
              <Col key={like.id} md={6} lg={4}>
                <Card className={`like-card ${isDarkMode ? 'dark' : 'light'}`}>
                  <Card.Body>
                    <div className="like-content">
                      <p className="mb-2">
                        Вы поставили лайк пользователю
                      </p>
                      <small className="text-muted d-block mb-3">
                        {new Date(like.createdAt).toLocaleDateString()}
                      </small>
                      <div className="d-flex  flex-wrap align-items-center ">
                        <Button 
                          onClick={() => handleProfileClick(like.likedId)}
                          className="view-profile-btn"
                        >
                          Просмотреть
                        </Button>
                        <Button 
                          onClick={() => handleUnlike(like.id)}
                          className="unlike-btn"
                        >
                          Убрать
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MyLikes; 