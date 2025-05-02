import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import  UserCard  from '../../components/UserCard/UserCard';
import './CommunityDetails.scss';
import api from '../../Api';

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        // Загрузка данных сообщества
        const communityData = await api.getCommunityById(id);
        setCommunity(communityData);

        // Загрузка участников сообщества
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

  const handleMemberClick = (userId) => {
    navigate(`/chats/${userId}`);
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
            <div className="members-grid">
              {members.map((member) => (
                <div key={member.userId} onClick={() => handleMemberClick(member.userId)}>
                  <UserCard
                    user={member}
                    className="member-card"
                  />
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