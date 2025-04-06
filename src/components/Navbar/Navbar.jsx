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
          YourLogo
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
              <Link to="/login" className="nav-link">
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Войти</span>
              </Link>
              <Link to="/register" className="nav-link register-button">
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Регистрация</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 