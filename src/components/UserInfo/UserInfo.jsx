import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Api/index';
import { showToast } from '../../utils/toast';
import InterestSelector from '../InterestSelector/InterestSelector';
import './UserInfo.scss';

const UserInfo = ({ userId, currentUserId }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    gender: '',
    location: '',
    birthdate: '',
    avatarUrl: '',
    photoUrl: '',
    nickname: '',
    interests: [],
    specialty: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const [profileData, userInterests, userSpecialty] = await Promise.all([
          api.getProfileById(userId),
          api.getUserInterests(userId),
          api.getUserSpecialty(userId)
        ]);

        if (profileData && !profileData.message) {
          const interests = Array.isArray(userInterests) ? userInterests : [];
          
          setUserData({
            username: 'Пользователь',
            avatar: profileData.avatarUrl || 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/5e227329363657.55ef8df90a1ca.png',
            photoUrl: profileData.photoUrl,
            bio: profileData.bio || 'Информация отсутствует',
            location: profileData.location || 'Не указано',
            joinDate: new Date().toISOString(),
            gender: profileData.gender || 'Не указано',
            birthdate: profileData.birthdate ? new Date(profileData.birthdate).toLocaleDateString() : 'Не указано',
            userId: profileData.userId,
            followersCount: 1,
            followingCount: 4,
            isFollowing: false,
            nickname: profileData.nickname || 'Не указано',
            interests: interests,
            specialty: userSpecialty
          });

          setFormData({
            bio: profileData.bio || '',
            gender: profileData.gender || '',
            location: profileData.location || '',
            birthdate: profileData.birthdate || '',
            photoUrl: profileData.photoUrl || '',
            avatarUrl: profileData.avatarUrl || '',
            nickname: profileData.nickname || '',
            interests: interests.map(interest => interest.id),
            specialty: userSpecialty?.id
          });
        } else {
          if (userId === currentUserId) {
            // Если это профиль текущего пользователя и он не найден,
            // перенаправляем на страницу создания профиля
            navigate('/create-profile');
          } else {
            showToast.warning('Не удалось загрузить профиль')
            throw new Error(profileData?.message || '');
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
        showToast.error('Ошибка при загрузке данных пользователя')
        if (err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
          setError('Не удалось подключиться к серверу. Пожалуйста, проверьте соединение.');
        } else {
          setError('Не удалось загрузить данные профиля');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const formattedBirthdate = formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : null;

      // Обновляем основные данные профиля
      const result = await api.updateProfile(userId, {
        bio: formData.bio || '',
        gender: formData.gender || '',
        location: formData.location || '',
        birthdate: formattedBirthdate,
        avatarUrl: formData.avatarUrl,
        photoUrl: formData.photoUrl,
        nickname: formData.nickname,
      });

      // Обновляем интересы пользователя
      if (formData.interests) {
        try {
          // Получаем текущие интересы пользователя
          const currentInterests = await api.getUserInterests(userId);
          const currentInterestIds = Array.isArray(currentInterests) 
            ? currentInterests.map(interest => interest.id)
            : [];

          // Находим интересы для добавления и удаления
          const interestsToAdd = formData.interests.filter(id => !currentInterestIds.includes(id));
          const interestsToRemove = currentInterestIds.filter(id => !formData.interests.includes(id));

          // Добавляем новые интересы
          for (const interestId of interestsToAdd) {
            await api.addUserInterest(userId, interestId);
          }

          // Удаляем старые интересы
          for (const interestId of interestsToRemove) {
            await api.removeUserInterest(userId, interestId);
          }

          // Получаем обновленный список интересов
          const updatedInterests = await api.getUserInterests(userId);
          setUserData(prev => ({
            ...prev,
            interests: Array.isArray(updatedInterests) ? updatedInterests : []
          }));
        } catch (interestsError) {
          console.error('Ошибка при обновлении интересов:', interestsError);
          showToast.warning('Некоторые интересы не удалось обновить');
        }
      }

      // Обновляем данные в интерфейсе
      setUserData(prev => ({
        ...prev,
        bio: formData.bio || prev.bio,
        location: formData.location || prev.location,
        gender: formData.gender || prev.gender,
        birthdate: formData.birthdate ? new Date(formData.birthdate).toLocaleDateString() : prev.birthdate,
        photoUrl: formData.photoUrl || prev.photoUrl,
        avatar: formData.avatarUrl || prev.avatar,
        nickname: formData.nickname || prev.nickname
      }));

      setIsEditing(false);
      setError(null); 
      showToast.success('Профиль успешно обновлен');

    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      // Даже при ошибке сетевого запроса, завершаем редактирование
      // так как данные могут успешно сохраняться
      setIsEditing(false);

      if (err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
        // Показываем сообщение об ошибке сети, но не блокируем сохранение данных
        console.warn('Проблемы с сетью, но данные могли быть сохранены');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="user-info loading">Загрузка данных пользователя...</div>;
  }

  if (error) {
    return <div className="user-info error">{error}</div>;
  }

  if (!userData) {
    return <div className="user-info error">Пользователь не найден</div>;
  }

  return (
    <div className="user-info">
      <div className="user-info__header">
        <div className="user-info__avatar">
          <img src={userData.avatar} alt="dsads" />
        </div>
        <div className="user-info__actions">
          {userId === currentUserId ? (
            <button
              className="edit-profile-btn"
              onClick={isEditing ? handleSaveProfile : handleEditProfile}
              disabled={isLoading}
            >
              {isEditing ? 'Сохранить' : 'Редактировать профиль'}
            </button>
          ) : (
            <button
              className={`follow-btn ${userData.isFollowing ? 'following' : ''}`}
              onClick={() => { }}
              disabled={isLoading}
            >
              {userData.isFollowing ? 'Отписаться' : 'Подписаться'}
            </button>
          )}
        </div>
      </div>

      <div className="user-info__content">
        <h2 className="user-info__name">{userData.nickname}</h2>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Имя пользователя:</label>
              <input
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="Имя пользователя"
              />
            </div>
            <div className="form-group">
              <label>О себе:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Расскажите о себе"
              />
            </div>
            <div className="form-group">
              <label>Местоположение:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ваш город"
              />
            </div>
            <div className="form-group">
              <label>Пол:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Не указано</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
            <div className="form-group">
              <label>Дата рождения:</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>URL аватара:</label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                placeholder="URL аватара"
              />
            </div>
            <div className="form-group">
              <label>URL фото:</label>
              <input
                type="text"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleInputChange}
                placeholder="URL изображения"
              />
            </div>
            <div className="form-group">
              <label>Интересы:</label>
              <InterestSelector
                value={formData.interests}
                onChange={(interests) => setFormData(prev => ({ ...prev, interests }))}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="user-info__bio">{userData.bio}</p>
            <div className="user-info__details">
              <span className="user-info__gender">
                {userData.gender === 'male' ? 'Мужской' :
                  userData.gender === 'female' ? 'Женский' : 'Пол не указан'}
              </span>
              <span className="user-info__location">{userData.location}</span>
              <span className="user-info__birthdate">
                {userData.birthdate !== 'Не указано' ? `Дата рождения: ${userData.birthdate}` : ''}
              </span>
              <span className="user-info__join-date">
                Присоединился: {new Date(userData.joinDate).toLocaleDateString()}
              </span>
              {userData.specialty && (
                <span className="user-info__specialty">
                  Специальность: {userData.specialty.name}
                </span>
              )}
              {userId === currentUserId ? (<></>) : (<>
                <Link to={ `/chats/${userId}`} className='btn btn-primary mt-4 w-100'
                >Написать
                </Link>
              </>)}
            </div>

            {userData.interests && userData.interests.length > 0 && (
              <div className="user-info__interests">
                <h3>Интересы:</h3>
                <div className="interests-list">
                {userData.interests.map((interestItem, index) => (
                    <span key={index} className="interest-tag">
                      {interestItem.interest ? interestItem.interest.name : interestItem.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="user-info__stats">
          <div className="stat-item">
            <span className="stat-value">{userData.followersCount || 0}</span>
            <span className="stat-label">Подписчиков</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userData.followingCount || 0}</span>
            <span className="stat-label">Подписок</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 