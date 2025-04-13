import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoutesWrapper from "./routes/Routes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import Settings from './components/Settings/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

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
    <AuthProvider>
      <Router>
        <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
        <ToastContainer />
          <Layout
            isLoggedIn={isLoggedIn}
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
            onLogout={handleLogout}
          >
            <Routes>
              <Route path="/settings" element={<Settings />} />
              <Route path="/*" element={
                <RoutesWrapper 
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              } />
            </Routes>
          </Layout>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
