import React from 'react';
import UserInfo from '../UserInfo/UserInfo';
import UserStats from '../UserStats/UserStats';
import './ProfileComponent.scss';

const ProfileComponent = ({ userId, currentUserId }) => {
    return (
        <div className="profile-component">
            <div className="profile-container">
                <div className="profile-left">
                    <UserInfo userId={userId} currentUserId={currentUserId} />
                </div>
                <div className="profile-right">
                    <div className="profile-stats">
                        <UserStats userId={userId} />
                    </div>

                </div>
            </div>
            <div className="profile-activity-section">
            </div>
        </div>
    );
};

export default ProfileComponent; 