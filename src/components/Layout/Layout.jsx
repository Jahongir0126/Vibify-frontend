import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

import './Layout.scss';

const Layout = ({ children, isLoggedIn, isDarkMode, onThemeToggle, onLogout }) => {
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  // Listen for sidebar pin state changes
  useEffect(() => {
    const handleSidebarPinChange = (e) => {
      if (e.detail && e.detail.isPinned !== undefined) {
        setIsSidebarPinned(e.detail.isPinned);
      }
    };

    window.addEventListener('sidebarPinChange', handleSidebarPinChange);
    return () => {
      window.removeEventListener('sidebarPinChange', handleSidebarPinChange);
    };
  }, []);

  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar 
        isLoggedIn={isLoggedIn}
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
      />
      <Sidebar isLoggedIn={isLoggedIn} />
      <main className={`main-content ${isSidebarPinned ? 'sidebar-pinned' : ''}`}>
        {children}
      </main>
      {/* <Footer 
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      /> */}
    </div>
  );
};

export default Layout; 