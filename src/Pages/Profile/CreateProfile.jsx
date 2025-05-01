import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialtySelector from '../../components/SpecialtySelector/SpecialtySelector';
import InterestSelector from '../../components/InterestSelector/InterestSelector';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import api from '../../Api/index';
import './CreateProfile.scss';

function  CreateProfile () {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: getUserIdFromToken(),
    fullName: '',
    bio: 'Учусь В ТУИТ',
    gender: 'male',
    location: 'Tashkent',
    birthdate: '2004-01-26',
    avatarUrl: '',
    photoUrl: '',
    nickname: '',
    specialtyId: '',
    interestIds: []
  });

  const [errors, setErrors] = useState({});
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (type === 'avatar') {
        setUploadingAvatar(true);
      } else {
        setUploadingPhoto(true);
      }

      const imageUrl = await uploadImageToCloudinary(file, type);
      
      setFormData(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatarUrl' : 'photoUrl']: imageUrl
      }));

      showToast.success(`${type === 'avatar' ? 'Аватар' : 'Фото'} успешно загружен`);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      showToast.error(`Ошибка загрузки ${type === 'avatar' ? 'аватара' : 'фото'}`);
    } finally {
      if (type === 'avatar') {
        setUploadingAvatar(false);
      } else {
        setUploadingPhoto(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Введите никнейм';
    }
    if (!formData.bio.trim()) {
      newErrors.bio = 'Расскажите о себе';
    }
    if (!formData.avatarUrl) {
      newErrors.avatarUrl = 'Загрузите аватар';
    }
    if (!formData.specialtyId) {
      newErrors.specialtyId = 'Выберите специальность';
    }
    if (formData.interestIds.length === 0) {
      newErrors.interestIds = 'Выберите хотя бы один интерес';
    }
    if (!formData.birthdate) {
      newErrors.birthdate = 'Укажите дату рождения';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    let uploadedImages = [];
    let createdProfile = null;
    
    try {
      const userId = getUserIdFromToken();

      const profileData = {
        userId: userId,
        nickname: formData.nickname.trim(),
        bio: formData.bio.trim(),
        gender: formData.gender,
        location: formData.location.trim(),
        birthdate: formData.birthdate,
        avatarUrl: formData.avatarUrl,
        photoUrl: formData.photoUrl || null
      };

      if (formData.avatarUrl) {
        uploadedImages.push(formData.avatarUrl);
      }
      if (formData.photoUrl) {
        uploadedImages.push(formData.photoUrl);
      }

      // Создаем профиль
      const response = await api.createProfile(profileData);
      createdProfile = response;

      // Сохраняем специальность
      if (formData.specialtyId) {
        try {
          const specialtyResponse = await api.addUserSpecialty(userId, formData.specialtyId);
          if (!specialtyResponse) {
            throw new Error('Ошибка при добавлении специальности');
          }
        } catch (specialtyError) {
          console.error('Ошибка при сохранении специальности:', specialtyError);
          showToast.warning('Специальность не удалось сохранить');
        }
      }

      // Сохраняем интересы
      if (formData.interestIds && formData.interestIds.length > 0) {
        try {
          const interestPromises = formData.interestIds.map(interestId => 
            api.addUserInterest(userId, interestId)
          );
          await Promise.all(interestPromises);
        } catch (interestsError) {
          console.error('Ошибка при сохранении интересов:', interestsError);
          showToast.warning('Некоторые интересы не удалось сохранить');
        }
      }

      showToast.success('Профиль успешно создан');
      
      // Обновляем страницу профиля для отображения новых данных
      setTimeout(() => {
        navigate(`/profile/${userId}`);
      }, 1000);
      
    } catch (error) {
      console.error('Ошибка при создании профиля:', error);
      
      // Удаляем загруженные изображения в случае ошибки
      if (uploadedImages.length > 0 && !createdProfile) {
        try {
          for (const imageUrl of uploadedImages) {
            await api.deleteCloudinaryImage(imageUrl);
          }
        } catch (deleteError) {
          console.error('Ошибка при удалении изображений:', deleteError);
        }
      }

      if (error.status === 409) {
        setErrors(prev => ({
          ...prev,
          nickname: 'Пользователь с таким никнеймом уже существует'
        }));
        showToast.error('Пользователь с таким никнеймом уже существует');
      } else {
        showToast.error('Ошибка при создании профиля');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile">
      <h1>Создание профиля</h1>
      <form onSubmit={handleSubmit} className="create-profile__form">
        <div className="form-group">
          <label>Никнейм</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            placeholder="Введите никнейм"
            className={errors.nickname ? 'error' : ''}
          />
          {errors.nickname && <div className="error-text">{errors.nickname}</div>}
        </div>

        <div className="form-group">
          <label>О себе</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Расскажите о себе"
            className={errors.bio ? 'error' : ''}
          />
          {errors.bio && <div className="error-text">{errors.bio}</div>}
        </div>

        <div className="form-group">
          <label>Пол</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>

        <div className="form-group">
          <label>Местоположение</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Укажите город"
          />
        </div>

        <div className="form-group">
          <label>Дата рождения</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
            className={errors.birthdate ? 'error' : ''}
          />
          {errors.birthdate && <div className="error-text">{errors.birthdate}</div>}
        </div>

        <div className="form-group">
          <label>Аватар профиля</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'avatar')}
            disabled={uploadingAvatar}
            className={errors.avatarUrl ? 'error' : ''}
          />
          {uploadingAvatar && <div className="upload-status">Загрузка аватара...</div>}
          {errors.avatarUrl && <div className="error-text">{errors.avatarUrl}</div>}
          {formData.avatarUrl && (
            <div className="avatar-preview">
              <img src={formData.avatarUrl} alt="Avatar preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Фото профиля (необязательно)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'photo')}
            disabled={uploadingPhoto}
          />
          {uploadingPhoto && <div className="upload-status">Загрузка фото...</div>}
          {formData.photoUrl && (
            <div className="photo-preview">
              <img src={formData.photoUrl} alt="Photo preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Специальность</label>
          <SpecialtySelector
            value={formData.specialtyId}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, specialtyId: value }));
              if (errors.specialtyId) {
                setErrors(prev => ({ ...prev, specialtyId: '' }));
              }
            }}
            error={errors.specialtyId}
          />
        </div>

        <div className="form-group">
          <label>Интересы</label>
          <InterestSelector
            value={formData.interestIds}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, interestIds: value }));
              if (errors.interestIds) {
                setErrors(prev => ({ ...prev, interestIds: '' }));
              }
            }}
            error={errors.interestIds}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || uploadingAvatar || uploadingPhoto}
        >
          {loading ? 'Создание профиля...' : 'Создать профиль'}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;  