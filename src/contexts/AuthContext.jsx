import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст авторизации
const AuthContext = createContext();

// Хук для использования контекста авторизации в компонентах
export function useAuth() {
  return useContext(AuthContext);
}

// Провайдер контекста авторизации
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Имитация загрузки пользователя (в реальном приложении здесь будет подключение к бэкенду)
  useEffect(() => {
    // Имитация запроса к API
    setTimeout(() => {
      // Демонстрационный пользователь
      const mockUser = {
        uid: '123456789',
        email: 'user@example.com',
        displayName: 'Иван Иванов',
        photoURL: null // можно добавить URL для аватара
      };
      
      setCurrentUser(mockUser);
      setLoading(false);
    }, 1000);
    
    // Очистка при размонтировании
    return () => {
      // Здесь можно добавить логику для отписки от слушателей
    };
  }, []);

  // Функция для входа в систему
  const login = async (email, password) => {
    // Имитация API запроса
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'user@example.com' && password === 'password') {
          const mockUser = {
            uid: '123456789',
            email: email,
            displayName: 'Иван Иванов',
            photoURL: null
          };
          
          setCurrentUser(mockUser);
          resolve(mockUser);
        } else {
          reject(new Error('Неверный email или пароль'));
        }
      }, 1000);
    });
  };

  // Функция для выхода из системы
  const logout = async () => {
    // Имитация API запроса
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        resolve();
      }, 1000);
    });
  };

  // Функция для регистрации
  const signup = async (email, password, displayName) => {
    // Имитация API запроса
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // В реальном приложении здесь будет проверка на существующего пользователя
        const mockUser = {
          uid: Math.random().toString(36).substring(2, 15),
          email: email,
          displayName: displayName,
          photoURL: null
        };
        
        setCurrentUser(mockUser);
        resolve(mockUser);
      }, 1000);
    });
  };

  // Функция для обновления данных пользователя
  const updateProfile = async (data) => {
    // Имитация API запроса
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(prevUser => ({
          ...prevUser,
          ...data
        }));
        resolve();
      }, 1000);
    });
  };

  // Функция для сброса пароля
  const resetPassword = async (email) => {
    // Имитация API запроса
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Отправлен запрос на сброс пароля для ${email}`);
        resolve();
      }, 1000);
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    signup,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && <div className="auth-loading">Загрузка...</div>}
    </AuthContext.Provider>
  );
}

export default AuthContext; 