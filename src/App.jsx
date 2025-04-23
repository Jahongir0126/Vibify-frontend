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
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
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

  return (
    <Router>
      <AuthProvider>
        <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
          <ToastContainer />
          <Layout
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
          >
            <Routes>
              <Route path="/*" element={
                <RoutesWrapper 
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              } />
            </Routes>
          </Layout>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
