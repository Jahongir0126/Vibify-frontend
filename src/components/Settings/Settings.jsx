import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Preferences from '../Preferences/Preferences';
import api from '../../Api';
import './Settings.scss';

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('preferences');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="settings-loading">
          <div className="loader"></div>
          <p>Загрузка предпочтений...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'preferences':
        return <Preferences userId={currentUser?.uid} />;
      case 'account':
        return (
          <div className="account-settings">
            <h3>Настройки аккаунта</h3>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={currentUser?.email || ''} disabled />
              <small>Для изменения email обратитесь в поддержку</small>
            </div>
            <div className="form-group">
              <label>Имя пользователя</label>
              <input type="text" value={currentUser?.displayName || ''} disabled />
              <button className="edit-button">Изменить</button>
            </div>
            <div className="account-actions">
              <button className="change-password-button">Сменить пароль</button>
              <button className="delete-account-button">Удалить аккаунт</button>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="notification-settings">
            <h3>Настройки уведомлений</h3>
            <div className="notification-option">
              <div>
                <h4>Новые сообщения</h4>
                <p>Получать уведомления о новых сообщениях</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="notification-option">
              <div>
                <h4>Новые совпадения</h4>
                <p>Получать уведомления о новых совпадениях интересов</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="notification-option">
              <div>
                <h4>Обновления системы</h4>
                <p>Получать уведомления о новых функциях и обновлениях</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="privacy-settings">
            <h3>Настройки приватности</h3>
            <div className="privacy-option">
              <div>
                <h4>Видимость профиля</h4>
                <p>Кто может видеть ваш профиль</p>
              </div>
              <select defaultValue="all">
                <option value="all">Все пользователи</option>
                <option value="matches">Только совпадения</option>
                <option value="nobody">Никто</option>
              </select>
            </div>
            <div className="privacy-option">
              <div>
                <h4>Скрыть возраст</h4>
                <p>Не показывать ваш возраст в профиле</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="privacy-option">
              <div>
                <h4>Анонимный режим</h4>
                <p>Просматривать профили анонимно</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );
      default:
        return <Preferences userId={currentUser?.uid} />;
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Настройки</h1>
      
      <div className="settings-content">
        <div className="settings-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Аватар пользователя" />
              ) : (
                <div className="avatar-placeholder">{currentUser?.displayName?.charAt(0) || 'U'}</div>
              )}
            </div>
            <div className="user-details">
              <h3>{currentUser?.displayName || 'Пользователь'}</h3>
              <p>{currentUser?.email}</p>
            </div>
          </div>
          
          <ul className="settings-nav">
            <li 
              className={activeTab === 'preferences' ? 'active' : ''} 
              onClick={() => setActiveTab('preferences')}
            >
              Предпочтения
            </li>
            <li 
              className={activeTab === 'account' ? 'active' : ''} 
              onClick={() => setActiveTab('account')}
            >
              Аккаунт
            </li>
            <li 
              className={activeTab === 'notifications' ? 'active' : ''} 
              onClick={() => setActiveTab('notifications')}
            >
              Уведомления
            </li>
            <li 
              className={activeTab === 'privacy' ? 'active' : ''} 
              onClick={() => setActiveTab('privacy')}
            >
              Приватность
            </li>
          </ul>
        </div>
        
        <div className="settings-main">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
