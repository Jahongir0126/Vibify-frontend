import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faComments, 
  faTrophy, 
  faSearch, 
  faBell, 
  faStar, 
  faPalette, 
  faCog, 
  faHome, 
  faSignOutAlt,
  faThumbtack
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.scss';

const menuItems = [
  { icon: faHome, label: 'Home', path: '/' },
  { icon: faUser, label: 'Профиль', path: '/profile' },
  { icon: faComments, label: 'Чаты', path: '/chats' },
  { icon: faTrophy, label: 'Челленджи', path: '/challenges' },
  { icon: faSearch, label: 'Поиск', path: '/search' },
  { icon: faBell, label: 'Уведомления', path: '/notifications' },
  { icon: faStar, label: 'Избранные', path: '/favorites' },
  { icon: faSignOutAlt, label: 'Выход', path: '/logout' },
];

const Sidebar: React.FC = () => {
  const [isPinned, setIsPinned] = useState(false);

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
          <a key={index} href={item.path} className="sidebar-item">
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 