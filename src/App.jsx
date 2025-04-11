import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom"
import RoutesWrapper from "./routes/Routes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';
import Layout from './components/Layout/Layout';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Загрузка темы из localStorage при запуске
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Проверка системных предпочтений
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    
    setIsLoggedIn(!!token);
  }, []);

  // Применение темы
  useEffect(() => {
    // Сохранение в localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Применение темы к документу
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Установка мета-тега для цвета темы мобильного браузера
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#1a1a1a' : '#ffffff');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <BrowserRouter>
        <Layout
          isLoggedIn={isLoggedIn}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          onLogout={handleLogout}
        >
          <RoutesWrapper isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </Layout>
        <ToastContainer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
