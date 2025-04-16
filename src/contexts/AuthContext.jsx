import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserIdFromToken } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const userId = getUserIdFromToken(token);
      setCurrentUser({
        uid: userId
      });
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('accessToken', token);
    setCurrentUser({
      uid: getUserIdFromToken(token)
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    isLoggedIn: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 