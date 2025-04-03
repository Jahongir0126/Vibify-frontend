import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../Api';

const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const showToast = useCallback((message, type = 'success') => {
    toast[type](message, TOAST_CONFIG);
  }, []);

  const handleAuthResponse = useCallback((response) => {
    if (response.message) {
      showToast(response.message, 'error');
      throw new Error(response.message);
    }

    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      console.log(response.data);1
      
      showToast(type === 'login' ? 'Успешный вход!' : 'Регистрация успешна!');
      
      setTimeout(() => {
        navigate('/');
      }, 1400);
    }
  }, [navigate, showToast]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login(credentials);
      handleAuthResponse(response, 'login');
    } catch (error) {
      setError(error.message || 'Ошибка входа');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleAuthResponse]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.register(userData);
      handleAuthResponse(response, 'register');
    } catch (error) {
      setError(error.message || 'Ошибка регистрации');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleAuthResponse]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.signOut({ refreshToken });
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setLoading(false);
      showToast('Вы успешно вышли из системы');
      navigate('/login');
    }
  }, [navigate, showToast]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
}; 