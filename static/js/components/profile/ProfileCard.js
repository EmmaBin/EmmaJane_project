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
            navigate(`/${user.fname}/project`);
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
                        <summary className="summary-container">
                            <div className='summary-title'>Current Projects</div>
                            <span className="project-arrow"></span>
                        </summary>

                        <ul>
                            {user.current_projects.map((project) => (
                                <li key={project.id}>
                                    <div className="project-info">
                                        <div className="project-details">
                                            <div className="project-title">{project.pname}</div>
                                            <div className="project-location">{project.address}</div>
                                        </div>
                                        <button className="view-job-btn">View job</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
                <div className="previous-projects">
                    <details>
                        <summary className="summary-container">
                            <div className='summary-title'>Previous Projects</div>
                            <span className="project-arrow"></span>
                        </summary>
                        <ul>
                            <li>
                                <div className="project-info">
                                    <div className="project-details">
                                        <div className="project-title">Previous Project 1</div>
                                        <div className="project-location">Location 1</div>
                                    </div>

                                    <button className="view-job-btn">View job</button>
                                </div>
                            </li>
                            <li>
                                <div className="project-info">
                                    <div className="project-details">
                                        <div className="project-title">Previous Project 2</div>
                                        <div className="project-location">Location 2</div>
                                    </div>

                                    <button className="view-job-btn">View job</button>
                                </div>
                            </li>
                        </ul>

                    </details>
                </div>
            </div>
            <div className="add-project-button-container">
                <button className="add-project-button" onClick={handleAddProject}>Add new project</button>
            </div>
        </div>
    );
};

export default ProfileCard;

