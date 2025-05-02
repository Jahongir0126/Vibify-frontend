import axios from "axios";
import { data } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

// Функция для декодирования JWT токена
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Создаем экземпляр axios с базовым URL
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик для добавления токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const api = {
  // ###################### Аутентификация ####################
  login: async (user) => {
    try {
      const response = await apiClient.post('/user-service/sign-in', user);
      const decodedToken = decodeJWT(response.data.accessToken);

      return {
        data: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          username: user.username,
          userId: decodedToken?.id
        }
      };
    } catch (error) {
      console.error('API login error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка входа' };
    }
  },

  register: async (user) => {
    try {
      const response = await apiClient.post('/user-service/sign-up', user);
      const decodedToken = decodeJWT(response.data.accessToken);

      return {
        data: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          username: user.username,
          userId: decodedToken?.id
        }
      };
    } catch (error) {
      console.error('API register error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка регистрации' };
    }
  },

  signOut: async (refreshToken) => {
    try {
      const response = await apiClient.post('/user-service/sign-out', { refreshToken });
      return response.data;
    } catch (error) {
      console.error('API signOut error:', error.response?.data);
      return error.response?.data;
    }
  },

  // ###################### Пользователи ####################
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/user-service/users');
      return response.data;

    } catch (error) {
      console.error('API get users error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения пользователей' };
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await apiClient.put(`/user-service/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API update user error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка обновления пользователя' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/user-service/${id}`);
      return response.data;
    } catch (error) {
      console.error('API delete user error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка удаления пользователя' };
    }
  },

  // ###################### Сообщения ####################
  sendMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/message', messageData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API send message error:', error);

      // Обработка ошибки 409 (Конфликт)
      if (error.response?.status === 409) {
        return {
          success: false,
          error: 'Сообщение уже существует или конфликт данных',
          status: 409,
          details: error.response?.data
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка отправки сообщения',
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },

  getAllMessages: async () => {
    try {
      const response = await apiClient.get('/message');
      return response.data;
    } catch (error) {
      console.error('API get messages error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения сообщений' };
    }
  },

  getUserMessages: async (userId) => {
    try {
      const response = await apiClient.get(`/message/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API get user messages error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения сообщений пользователя' };
    }
  },

  updateMessage: async (messageId, messageData) => {
    try {
      const response = await apiClient.put(`/message/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      console.error('API update message error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка обновления сообщения' };
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await apiClient.delete(`/message/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('API delete message error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка удаления сообщения' };
    }
  },

  // ###################### Профиль ####################


  getProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API get profile error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения профиля' };
    }
  },

  updateProfile: async (id, profileData) => {
    try {
      const response = await apiClient.patch(`/profile/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error('API update profile error:', error);
      if (error.code === 'ERR_NETWORK') {
        return { success: true, message: 'Данные могли быть сохранены, но произошла ошибка соединения' };
      }
      return error.response?.data || { message: 'Ошибка обновления профиля' };
    }
  },

  createProfile: async (profileData) => {
    try {
      const response = await apiClient.post('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('API create profile error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка создания профиля' };
    }
  },

  getAllProfiles: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      console.error('API get profiles error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения профилей' };
    }
  },

  getProfileById: async (id) => {
    try {
      const response = await apiClient.get(`/profile/${id}`);
      return response.data;
    } catch (error) {
      console.error('API get profile error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения профиля' };
    }
  },

  deleteProfile: async (id) => {
    try {
      const response = await apiClient.delete(`/profile/${id}`);
      return response.data;
    } catch (error) {
      console.error('API delete profile error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка удаления профиля' };
    }
  },

  // ###################### Предпочтения ####################
  createPreferences: async (preferencesData) => {
    try {
      // Форматируем данные перед отправкой
      const formattedData = {
        userId: preferencesData.userId,
        preferredGender: preferencesData.preferredGender || null,
        ageMin: parseInt(preferencesData.ageMin) || 18,
        ageMax: parseInt(preferencesData.ageMax) || 35,
        locationRadius: parseInt(preferencesData.locationRadius) || 50,
      };

      const response = await apiClient.post('/preferences', formattedData);
      return response.data;
    } catch (error) {
      console.error('API create preferences error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка создания предпочтений' };
    }
  },

  getAllPreferences: async () => {
    try {
      const response = await apiClient.get('/preferences');
      return response.data;
    } catch (error) {
      console.error('API get preferences error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения предпочтений' };
    }
  },

  getPreferencesById: async (userId) => {
    try {
      const response = await apiClient.get(`/preferences/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API get preferences error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения предпочтений' };
    }
  },

  updatePreferences: async (id, preferencesData) => {

    try {
      // Форматируем данные перед отправкой
      const formattedData = {
        preferredGender: preferencesData.preferredGender,
        ageMin: parseInt(preferencesData.ageMin),
        ageMax: parseInt(preferencesData.ageMax),
        locationRadius: parseInt(preferencesData.locationRadius),
      };

      const response = await apiClient.patch(`/preferences/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('API update preferences error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка обновления предпочтений' };
    }
  },

  deletePreferences: async (id) => {
    try {
      const response = await apiClient.delete(`/preferences/${id}`);
      return response.data;
    } catch (error) {
      console.error('API delete preferences error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка удаления предпочтений' };
    }
  },

  // ###################### Лайки ####################
  checkLike: async (likerId, likedId) => {
    try {
      const response = await apiClient.post('/likes/check', {
        likerId,
        likedId
      });
      return response.data;
    } catch (error) {
      console.error('API check like error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка проверки лайка' };
    }
  },

  createLike: async (likerId, likedId) => {
    try {
      const response = await apiClient.post('/likes', {
        likerId,
        likedId
      });
      return response.data;
    } catch (error) {
      console.error('API create like error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка создания лайка' };
    }
  },

  getAllLikes: async () => {
    try {
      const response = await apiClient.get('/likes');
      return response.data;
    } catch (error) {
      console.error('API get likes error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения лайков' };
    }
  },

  getUserLikes: async (userId) => {
    try {
      const response = await apiClient.get(`/likes/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API get user likes error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения лайков пользователя' };
    }
  },

  deleteLike: async (likeId) => {
    try {
      const response = await apiClient.delete(`/likes/${likeId}`);
      return response.data;
    } catch (error) {
      console.error('API delete like error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка удаления лайка' };
    }
  },

  // ###################### Специальности ####################
  addUserSpecialty: async (userId, specialtyId) => {
    try {
      const response = await apiClient.post('/specialties/user', {
        userId,
        specialtyId
      });
      return response.data;
    } catch (error) {
      console.error('API add user specialty error:', error.response?.data);
      throw error.response?.data || { message: 'Ошибка добавления специальности' };
    }
  },

  getUserSpecialty: async (userId) => {
    try {
      const response = await apiClient.get(`/specialties/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API get user specialty error:', error.response?.data);
      throw error.response?.data || { message: 'Ошибка получения специальности' };
    }
  },

  // Методы для работы со специальностями
  getAllSpecialties: async () => {
    try {
      const response = await apiClient.get('/specialties');
      return await response.data
    } catch (error) {
      console.error('Ошибка API:', error);
      throw error;
    }
  },

  getSpecialtyById: async (id) => {
    try {
      const response = await apiClient.get(`/specialties/${id}`);
      if (!response.ok) {
        throw new Error('Специальность не найдена');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка API:', error);
      throw error;
    }
  },

  // ###################### Интересы ####################
  getAllInterests: async () => {
    try {
      const response = await apiClient.get('/interests');
      return response.data;
    } catch (error) {
      console.error('API get all interests error:', error.response?.data);
      throw error.response?.data || { message: 'Ошибка получения списка интересов' };
    }
  },

  addUserInterest: async (userId, interestId) => {
    try {
      const response = await apiClient.post('/interests/user', {
        userId,
        interestId
      });
      return response.data;
    } catch (error) {
      console.error('API add user interest error:', error.response?.data);
      throw error.response?.data || { message: 'Ошибка добавления интереса' };
    }
  },

  removeUserInterest: async (userId, interestId) => {
    try {
      const response = await apiClient.delete('/interests/user', {
        data: {
          userId,
          interestId
        }
      });
      return response.data;
    } catch (error) {
      console.error('API remove user interest error:', error.response?.data);
      throw error.response?.data || { message: 'Ошибка удаления интереса' };
    }
  },

  getUserInterests: async (userId) => {
    try {
      const response = await apiClient.get(`/interests/user/${userId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('API get user interests error:', error.response?.data);
      return [];
    }
  },

  // ###################### Сообщества ####################
  getAllCommunities: async () => {
    try {
      const response = await apiClient.get('/community');
      return response.data;
    } catch (error) {
      console.error('API get communities error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения сообществ' };
    }
  },

  getCommunityById: async (id) => {
    try {
      const response = await apiClient.get(`/community/${id}`);
      return response.data;
    } catch (error) {
      console.error('API get community error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения сообщества' };
    }
  },

  createCommunity: async (communityData) => {
    try {
      const response = await apiClient.post('/community', communityData);
      return response.data;
    } catch (error) {
      console.error('API create community error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка создания сообщества' };
    }
  },

  updateCommunity: async (id, communityData) => {
    try {
      const response = await apiClient.patch(`/community/${id}`, communityData);
      return response.data;
    } catch (error) {
      console.error('API update community error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка обновления сообщества' };
    }
  },

  deleteCommunity: async (id) => {
    try {
      const response = await apiClient.delete(`/community/${id}`);
      return response.data;
    } catch (error) {
      console.error('API delete community error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка удаления сообщества' };
    }
  },

  joinCommunity: async (userId, communityId) => {
    try {
      const response = await apiClient.post(`/community/${communityId}/join`, { userId });
      return response.data;
    } catch (error) {
      console.error('API join community error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка при присоединении к сообществу' };
    }
  },

  leaveCommunity: async (userId, communityId) => {
    try {
      const response = await apiClient.post(`/community/${communityId}/leave`, { userId });
      return response.data;
    } catch (error) {
      console.error('API leave community error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка при выходе из сообщества' };
    }
  },

  getUserCommunities: async (userId) => {
    try {
      const response = await apiClient.get(`/community/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API get user communities error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения сообществ пользователя' };
    }
  },

  getCommunityUsers: async (communityId) => {
    try {
      const response = await apiClient.get(`/community/${communityId}/users`);
      return response.data;
    } catch (error) {
      console.error('API get community users error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения пользователей сообщества' };
    }
  },

  searchCommunitiesByInterests: async (interestIds) => {
    try {
      const response = await apiClient.post('/community/search/by-interests', { interestIds });
      return response.data;
    } catch (error) {
      console.error('API search communities by interests error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка поиска сообществ по интересам' };
    }
  },

  searchCommunitiesBySpecialty: async (specialtyId) => {
    try {
      const response = await apiClient.get(`/community/specialty/${specialtyId}`);
      return response.data;
    } catch (error) {
      console.error('API search communities by specialty error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка поиска сообществ по специальности' };
    }
  },


};

export default api;