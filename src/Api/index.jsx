import axios from "axios";

const BASE_URL = "http://localhost:3000";

// Функция для декодирования JWT токена
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
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

  getProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API get profile error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка получения профиля' };
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      const response = await apiClient.put(`/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('API update profile error:', error.response?.data);
      return error.response?.data || { message: 'Ошибка обновления профиля' };
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

  // ###################### Чат ####################
//   getAllChats: () => {
//     const res = axios.get(`${BASE_URL}/chat-service/chats`)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return res;
//   },

//   getChatMessages: (chatId) => {
//     const res = axios.get(`${BASE_URL}/chat-service/chats/${chatId}/messages`)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return res;
//   },

//   sendMessage: (chatId, message) => {
//     const res = axios.post(`${BASE_URL}/chat-service/chats/${chatId}/messages`, message)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return res;
//   }
};

export default api; 