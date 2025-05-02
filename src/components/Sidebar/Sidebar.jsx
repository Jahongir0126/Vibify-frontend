import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faComments,
  faTrophy,
  faSearch,
  faBell,
  faStar,
  faHome,
  faThumbtack,
  faBars,
  faCog,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.scss';

const menuItems = [
  { icon: faHome, label: 'Home', path: '/' },
  { icon: faComments, label: 'Чаты', path: '/chats' },
  { icon: faUsers, label: 'Сообщества', path: '/communities' },
  { icon: faSearch, label: 'Поиск', path: '/search' },
  { icon: faTrophy, label: 'Челленджи', path: '/challenges' },
  { icon: faBell, label: 'Уведомления', path: '/notifications' },
  { icon: faStar, label: 'Избранные', path: '/favorites' },
  { icon: faCog, label: 'Настройка', path: '/settings' },
];

const Sidebar = () => {
  const [isPinned, setIsPinned] = useState(false);
  const location = useLocation();

  // Dispatch custom event when pin state changes
  useEffect(() => {
    const event = new CustomEvent('sidebarPinChange', {
      detail: { isPinned }
    });
    window.dispatchEvent(event);
  }, [isPinned]);

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  return (
    <aside className={`sidebar ${isPinned ? 'pinned' : ''}`}>
      <button className="pin-button" onClick={togglePin}>
        <FontAwesomeIcon
          icon={faThumbtack}
          className={`pin-icon ${isPinned ? 'pinned' : ''}`}
        />
      </button>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
        <div className="dropdown">
          <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <FontAwesomeIcon icon={faBars} className="sidebar-icon" />
            <span className="sidebar-label">Еще</span>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {menuItems.slice(4).map((item, index) => (
              <li key={index}>
                <Link className="dropdown-item" to={item.path}>
                  <FontAwesomeIcon icon={item.icon} className="sidebar-icon me-1" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;