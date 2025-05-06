import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './CommunityDetails.scss';
import api from '../../Api';
import { getUserIdFromToken } from '../../utils/auth';
import { showToast } from '../../utils/toast'

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = getUserIdFromToken();

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

  const handleChatClick = () => {
    navigate(`/community/${id}/chat`);
    console.log("s")
  };

  const handleMemberClick = (userId) => {
    if (currentUserId == userId) {
      showToast.info("Вы не можете написать самому себе!")
    } else {
      navigate(`/chats/${userId}`);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }
  const handleSignOutCommunity = async () => {

    const communityId = community.id;
    try {
      const res = await api.leaveCommunity(currentUserId, communityId)
      if (res) {
        showToast.info("Вы вышли из сообщества")
      }
      const membersData = await api.getCommunityUsers(id);
      setMembers(membersData);
    } catch (error) {
      console.log(error);
    }
  }

  const handleJoinCommunity = async (communityId) => {
    try {
      if (!currentUserId) {
        showToast.error('Необходима авторизация');
        return;
      }
      const response = await api.joinCommunity(currentUserId, communityId);
        showToast.success('Вы присоединились к сообществу');
        const membersData = await api.getCommunityUsers(id);
      setMembers(membersData);
    } catch (err) {
      console.error('Ошибка при присоединении к сообществу:', err);
      showToast.error('Не удалось присоединиться к сообществу');
    }
  };
  return (
    <div className="community-details">
      {community && (
        <>
          <div className="community-header">
            <div className="header-content">
              <h1>{community.name}</h1>
              <div className='d-flex flex-wrap gap-3'>
                <button className="chat-button" onClick={handleChatClick}>
                  <FontAwesomeIcon icon={faComments} />
                  Открыть чат
                </button>
                {members.some(member => member.userId === currentUserId) ? (
                  <button className="chat-button" onClick={handleSignOutCommunity}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Выйти
                  </button>
                ) : <button
                  onClick={() => handleJoinCommunity(community.id)}
                  className="chat-button"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Присоединиться
                </button>}
              </div>
            </div>
            <p>{community.description}</p>
          </div>

          <div className="community-members">
            <h2>Участники сообщества</h2>
            <div className="members-list">
              {members.map((member) => (
                <div key={member.userId} className="member-item">
                  <div className="member-avatar">
                    <img src={member.avatarUrl || member.photoUrl || "https://mir-s3-cdn-cf.behance.net/project_modules/fs/5e227329363657.55ef8df90a1ca.png"} alt={member.nickname} />
                  </div>
                  <div className="member-info">
                    <h3>{member.nickname}</h3>
                    <p className="member-bio">{member.bio || 'Нет информации о себе'}</p>
                    <p className="member-specialty">{member.specialty?.name || 'Специальность не указана'}</p>
                  </div>
                  <button
                    className="chat-button"
                    onClick={() => handleMemberClick(member.userId)}
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