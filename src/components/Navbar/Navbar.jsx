import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSignOutAlt,
  faMoon,
  faSun,
  faSignInAlt,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.scss';

const Navbar = ({ isDarkMode, onThemeToggle }) => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <svg width="250" height="80" viewBox="0 0 250 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vibifyGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF6FD8" />
                <stop offset="100%" stopColor="#3813C2" />
              </linearGradient>
            </defs>

            <text x="10" y="55"
              fontFamily="Montserrat, sans-serif"
              fontSize="48"
              fill="url(#vibifyGradient)"
              fontWeight="bold"
              letterSpacing="4"
              style={{ filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))" }}>
              Vibify
            </text>
          </svg>
        </Link>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={onThemeToggle}
            title={isDarkMode ? "Включить светлую тему" : "Включить тёмную тему"}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-link ms-3" title="Профиль">
                <FontAwesomeIcon icon={faUser} />
              </Link>
              <button className="nav-link logout-button ms-3" title="Выйти" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link ms-3" title="Войти">
                <FontAwesomeIcon icon={faSignInAlt} />
              </Link>
              <Link to="/register" className="nav-link ms-3" title="Регистрация">
                <FontAwesomeIcon icon={faUserPlus} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


