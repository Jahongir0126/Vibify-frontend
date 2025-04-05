import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom"
import RoutesWrapper from "./routes/Routes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <BrowserRouter>
        <RoutesWrapper isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? "dark" : "light"}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
