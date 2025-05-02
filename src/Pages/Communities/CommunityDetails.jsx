import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CommunityDetails.scss';
import api from '../../Api';
import { getUserIdFromToken } from '../../utils/auth';
import {showToast} from '../../utils/toast'

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const communityData = await api.getCommunityById(id);
        setCommunity(communityData);

        const membersData = await api.getCommunityUsers(id);
        setMembers(membersData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [id]);

  const handleChatClick = (userId) => {
    const currentUserId=getUserIdFromToken();
    if(currentUserId==userId){
      showToast.info("Вы не можете написать самому себе!")
    }else{

      navigate(`/chats/${userId}`);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="community-details">
      {community && (
        <>
          <div className="community-header">
            <h1>{community.name}</h1>
            <p>{community.description}</p>
          </div>
          
          <div className="community-members">
            <h2>Участники сообщества</h2>
            <div className="members-list">
              {members.map((member) => (
                <div key={member.userId} className="member-item">
                  <div className="member-avatar">
                    <img src={member.avatarUrl || member.photoUrl || "https://via.placeholder.com/50"} alt={member.nickname} />
                  </div>
                  <div className="member-info">
                    <h3>{member.nickname}</h3>
                    <p className="member-bio">{member.bio || 'Нет информации о себе'}</p>
                   
                  </div>
                  <button 
                    className="chat-button"
                    onClick={() => handleChatClick(member.userId)}
                  >
                    Написать
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommunityDetails;