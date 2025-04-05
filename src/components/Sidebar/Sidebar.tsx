import React from 'react';
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
  faMoon, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.scss';

const menuItems = [
  { icon: faUser, label: 'Профиль', path: '/profile' },
  { icon: faComments, label: 'Чаты', path: '/chats' },
  { icon: faTrophy, label: 'Челленджи', path: '/challenges' },
  { icon: faSearch, label: 'Поиск', path: '/search' },
  { icon: faBell, label: 'Уведомления', path: '/notifications' },
  { icon: faStar, label: 'Избранные', path: '/favorites' },
  { icon: faPalette, label: 'Интересы', path: '/interests' },
  { icon: faCog, label: 'Настройки', path: '/settings' },
  { icon: faMoon, label: 'Тема', path: '/theme' },
  { icon: faSignOutAlt, label: 'Выход', path: '/logout' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
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