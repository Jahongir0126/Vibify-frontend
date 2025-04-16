import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Api/index';
import './UserInfo.scss';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const UserInfo = ({ userId, currentUserId }) => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    gender: '',
    location: '',
    birthdate: '',
    avatarUrl: '',
    photoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const profileData = await api.getProfileById(userId);

        if (profileData && !profileData.message) {
          setUserData({
            nickname: profileData.nickname|| 'Пользователь',
            avatar: profileData.avatarUrl || 'https://via.placeholder.com/150',
            photoUrl: profileData.photoUrl,
            bio: profileData.bio || 'Информация отсутствует',
            location: profileData.location || 'Не указано',
            joinDate: new Date().toISOString(),
            gender: profileData.gender || 'Не указано',
            birthdate: profileData.birthdate ? new Date(profileData.birthdate).toLocaleDateString() : 'Не указано',
            userId: profileData.userId,
            followersCount: 1,
            followingCount: 4,
            isFollowing: false
          });

          setFormData({
            bio: profileData.bio || '',
            gender: profileData.gender || '',
            location: profileData.location || '',
            birthdate: profileData.birthdate || '',
            photoUrl: profileData.photoUrl || '',
            avatarUrl: profileData.avatarUrl || ''
          });
        } else {
          setUserData(null);
          if (userId === currentUserId) {
            setShowCreateProfile(true);
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
        setUserData(null);
        
        if (err.message === 'Profile not found' && userId === currentUserId) {
          setShowCreateProfile(true);
          setError(null);
        } else if (err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
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
  }, [userId]);

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
      // Форматируем дату рождения в формат YYYY-MM-DD
      const formattedBirthdate = formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : null;

      const result = await api.updateProfile(userId, {
        bio: formData.bio || '',
        gender: formData.gender || '',
        location: formData.location || '',
        birthdate: formattedBirthdate,
        avatarUrl: formData.avatarUrl,
        photoUrl: formData.photoUrl  // Используем текущий аватар как значение по умолчанию
      });

      // Обновляем данные пользователя независимо от результата,
      // так как данные могут успешно сохраняться в базе даже при ошибке в ответе
      setUserData(prev => ({
        ...prev,
        bio: formData.bio || prev.bio,
        location: formData.location || prev.location,
        gender: formData.gender || prev.gender,
        birthdate: formData.birthdate ? new Date(formData.birthdate).toLocaleDateString() : prev.birthdate,
        photoUrl: formData.photoUrl || prev.photoUrl,
        avatar: formData.avatarUrl || prev.avatar
      }));
      setIsEditing(false);
      setError(null); 
      toast.success('Профиль успешно обновлен',{
        theme: "dark",
        position: "top-right",
      })

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

  const handleCreateProfile = async () => {
    setIsLoading(true);
    try {
      const newProfileData = {
        bio: '',
        gender: '',
        location: '',
        birthdate: null,
        avatarUrl: 'https://via.placeholder.com/150',
        photoUrl: '',
        userId: userId
      };

      const result = await api.createProfile(newProfileData);
      
      if (result) {
        setUserData({
          nickname: localStorage.getItem("nickname") || 'Пользователь',
          avatar: newProfileData.avatarUrl,
          photoUrl: newProfileData.photoUrl,
          bio: newProfileData.bio || 'Информация отсутствует',
          location: newProfileData.location || 'Не указано',
          joinDate: new Date().toISOString(),
          gender: newProfileData.gender || 'Не указано',
          birthdate: 'Не указано',
          userId: userId,
          followersCount: 0,
          followingCount: 0,
          isFollowing: false
        });
        
        setFormData(newProfileData);
        setShowCreateProfile(false);
        toast.success('Профиль успешно создан', {
          theme: "dark",
          position: "top-right",
        });
      }
    } catch (err) {
      console.error('Ошибка при создании профиля:', err);
      toast.error('Не удалось создать профиль', {
        theme: "dark",
        position: "top-right",
      });
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

  if (!userData && !showCreateProfile) {
    return (
      <div className="user-info no-profile">
        <h3>Профиль не найден</h3>
        <p>У вас еще нет профиля. Хотите создать его сейчас?</p>
        <button 
          className="create-profile-btn"
          onClick={() => setShowCreateProfile(true)}
        >
          Создать профиль
        </button>
      </div>
    );
  }

  if (!userData && showCreateProfile) {
    return (
      <div className="profile-creation">
        <h2>Создание профиля</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateProfile();
        }} className="profile-form">
          <div className="form-group">
            <label htmlFor="bio">О себе</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Расскажите о себе..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Местоположение</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Ваш город"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Пол</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите пол</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Дата рождения</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Создание...' : 'Создать профиль'}
            </button>
          </div>
        </form>
      </div>
    );
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
              {userId === currentUserId ? (<></>) : (<>
                <Link to={ `/chats/${userId}`} className='btn btn-primary mt-4 w-100'
                >Написать
                </Link>
              </>)}
            </div>
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