import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Preferences from '../Preferences/Preferences';
import './Settings.scss';

const Settings = () => {
  const { currentUser } = useAuth();
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


  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Настройки</h1>
      <Preferences userId={currentUser?.uid} />
      <div className="settings-content">
      </div>
    </div>
  );
};

export default Settings;
