import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import './Footer.scss';

interface FooterProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode, onThemeToggle }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">О нас</a>
          <a href="/rules">Правила</a>
          <a href="/support">Поддержка</a>
        </div>
        <button 
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>
      </div>
    </footer>
  );
};

export default Footer; 