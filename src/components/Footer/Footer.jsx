import React from 'react';
import './Footer.scss';

const Footer = ({ isDarkMode, onThemeToggle }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">О нас</a>
          <a href="/rules">Правила</a>
          <a href="/support">Поддержка</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 