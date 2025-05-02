import React from 'react';
import CommunityList from '../../components/CommunityList/CommunityList';
import './Communities.scss';

const Communities = () => {
  return (
    <div className="communities-page">
      <h1>Сообщества</h1>
      <CommunityList />
    </div>
  );
};

export default Communities;