import React from 'react';
import Preferences from '../../components/Preferences/Preferences';
import './Settings.scss';

const Settings = () => {

  return (
    <div className="settings-container">
      <h1>Настройки</h1>
      <div className="settings-content">
        <Preferences />
      </div>
    </div>
  );
};

export default Settings;
