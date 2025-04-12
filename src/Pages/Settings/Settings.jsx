import React from 'react';
import Preferences from '../../components/Preferences/Preferences';
import './Settings.scss';

const Settings = () => {
  const userId = localStorage.getItem('userId');

  return (
    <div className="settings-container">
      <h1>Настройки</h1>
      <div className="settings-content">
        <Preferences userId={userId} />
      </div>
    </div>
  );
};

export default Settings;
