import React from 'react';
import Chats from '../../components/Chats/Chats';
import './Chats.scss';

const ChatsPage = () => {
  return (
    <div className="chats-page">
      <h1>Chats Page</h1>
      <Chats />
    </div>
  );
};

export default ChatsPage;
