import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.scss';

const Layout = ({ children, isLoggedIn, isDarkMode, onThemeToggle, onLogout }) => {
  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar />
      <Navbar 
        isLoggedIn={isLoggedIn}
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 