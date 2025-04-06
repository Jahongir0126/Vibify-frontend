import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSignOutAlt,
  faMoon,
  faSun,
  faSignInAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss';

const Navbar = ({ isLoggedIn, isDarkMode, onThemeToggle, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

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
              <Link to="/profile" className="nav-link">
                <FontAwesomeIcon icon={faUser} />
                <span>Профиль</span>
              </Link>
              <button className="nav-link logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Выйти</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link ms-3" title={"Войти"}>
                <FontAwesomeIcon icon={faSignInAlt} />
                
              </Link>

            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


