import React from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
    return (
        <div className="profile-card">
            <div className="profile-image">
                <img src="https://via.placeholder.com/50" alt="Profile" />
            </div>
            <div className="profile-info">
                <h2>Joey Park</h2>
                <p>Office</p>
            </div>
            <div className="projects">
                <div className="current-projects">
                    <details>
                        <summary>Current Projects</summary>
                        {/* List current projects here */}
                    </details>
                </div>
                <div className="previous-projects">
                    <details>
                        <summary>Previous Projects</summary>
                        {/* List previous projects here */}
                    </details>
                </div>
            </div>
            <button className="add-project-button">Add new project</button>
        </div>
    );
};

export default ProfileCard;
