import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import { decodeJWT } from '../utils/auth';
import { showToast } from '../utils/toast'

// Создаем контекст авторизации
const AuthContext = createContext();

// Хук для использования контекста авторизации в компонентах
export function useAuth() {
  return useContext(AuthContext);
}

// Провайдер контекста авторизации
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Инициализация состояния при загрузке
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = decodeJWT(token);
          if (decoded) {
            const userId = decoded.id;
            // Получаем данные пользователя
            try {
              setCurrentUser({
                id: userId
              });
              setIsLoggedIn(true);
            } catch (error) {
              console.error('Ошибка при получении данных пользователя:', error);
              // Если не удалось получить данные, устанавливаем базовую информацию
              setCurrentUser({ id: userId });
              setIsLoggedIn(true);
            }
          }
        } catch (error) {
          console.error('Ошибка при декодировании токена:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (userData) => {
    try {
      const response = await api.login(userData);
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        setCurrentUser({
          id: response.data.userId,
          username: userData.username
        });
        setIsLoggedIn(true);

        showToast.success('Успешный вход!');

        navigate('/');
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      showToast.error('Ошибка при входе!');
      return { success: false, error: error.message };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await api.register(userData);
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        setCurrentUser({
          id: response.data.userId,
          username: userData.username
        });
        setIsLoggedIn(true);
        showToast.success('Регистрация успешна!');

        navigate('/create-profile');
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      showToast.error("Ошибка при регистрации")
      return { success: false, error: error.message };
    }
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      api.signOut(refreshToken).catch(console.error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    setIsLoggedIn(false);

    showToast.success('Вы успешно вышли из системы!')
    navigate('/login');
  };

  const updateUserData = async (userData) => {
    try {
      if (!currentUser?.id) return { success: false, error: 'Пользователь не авторизован' };

      const response = await api.updateUser(currentUser.id, userData);
      if (response.success) {
        setCurrentUser(prev => ({
          ...prev,
          ...userData
        }));
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    isLoggedIn,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 