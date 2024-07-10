import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdModeEdit } from "react-icons/md";
import './ProfileCard.css';

const ProfileCard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/dashboard', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch profile');
                }
            })
            .then(data => setUser(data))
            .catch(error => console.error(error));
    }, []);

    const handleAddProject = () => {
        if (user) {
            navigate(`/${user.fname}/add_new_project`);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    let addNewProject = async (evt) => {
        evt.preventDefault();

    };

    return (
        <div className="profile-card">
            <div className="profile-image-container">
                <img className="profile-image" src="https://via.placeholder.com/50" alt="Profile" />
                <div className="icon-container">
                    <MdModeEdit className="custom-icon" size={14} />
                </div>
            </div>
            <div className="profile-info">
                <h2>{user.fname} {user.lname}</h2>
                <p>{user.role}</p>
            </div>
            <div className="projects">
                <div className="current-projects">
                    <details>
                        <summary className="project-title">
                            Current Projects
                            <span className="project-arrow"></span>
                        </summary>

                        <ul>
                            <li>Current Project 1</li>
                            <li>Current Project 2</li>
                        </ul>
                    </details>
                </div>
                <div className="previous-projects">
                    <details>
                        <summary className="project-title">
                            Previous Projects
                            <span className="project-arrow"></span>
                        </summary>
                        <ul>
                            <li>Previous Project 1</li>
                            <li>Previous Project 2</li>
                        </ul>

                    </details>
                </div>
            </div>
            <button className="add-project-button" onClick={handleAddProject}>Add new project</button>
        </div>
    );
};

export default ProfileCard;

