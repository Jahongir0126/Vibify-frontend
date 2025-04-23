import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/auth';
import api from '../../Api';
import './Notifications.scss';

const Notifications = ({ isDarkMode }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getAllLikes();
        if (response && Array.isArray(response)) {
          // Фильтруем лайки, где текущий пользователь является получателем
          const userNotifications = response.filter(like => like.likedId === currentUserId);
          setNotifications(userNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUserId]);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (!currentUserId) {
    return (
      <div className={`notifications-page ${isDarkMode ? 'dark' : 'light'}`}>
        <Container>
          <div className="text-center">Пожалуйста, войдите в систему</div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`notifications-page ${isDarkMode ? 'dark' : 'light'}`}>
      <Container>
        <h1 className="text-center mb-4">Уведомления</h1>
        {loading ? (
          <div className="text-center">Загрузка...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center">У вас пока нет уведомлений</div>
        ) : (
          <Row>
            {notifications.map((notification) => (
              <Col key={notification.id} md={6} lg={4}>
                <Card className={`notification-card ${isDarkMode ? 'dark' : 'light'}`}>
                  <Card.Body>
                    <div className="notification-content">
                      <p className="mb-2">
                        Пользователь поставил вам лайк
                      </p>
                      <small className="text-muted d-block mb-3">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button 
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleProfileClick(notification.likerId)}
                          className="view-profile-btn"
                        >
                          Просмотреть профиль
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

export default Notifications; 