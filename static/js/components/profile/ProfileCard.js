import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdModeEdit } from "react-icons/md";
import './ProfileCard.css';
import { Image, Transformation } from '@cloudinary/react';

const ProfileCard = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState('');
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
            .then(data => {
                setUser(data);
                setProfileImage(data.profileImage);
            })
            .catch(error => console.error(error));
    }, []);

    const handleAddProject = () => {
        if (user) {
            navigate(`/${user.fname}/project`);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://127.0.0.1:5000/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            if (data.secure_url) {
                setProfileImage(data.secure_url);
                // Update profile image in backend
                await updateProfileImageOnServer(data.secure_url);
            } else {
                throw new Error('Image upload failed, secure_url not found');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle error appropriately
        }
    };

    const updateProfileImageOnServer = async (secureUrl) => {
        try {
            // Check if user.user_id is defined
            if (!user || !user.id) {
                throw new Error('User ID is not defined');
            }
    
            console.log('Sending request to server with user ID:', user.id, 'and secure URL:', secureUrl);
    
            const response = await fetch('http://127.0.0.1:5000/update-profile-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.id, profileImage: secureUrl }), 
            });
    
            if (!response.ok) {
                throw new Error('Failed to update profile image');
            }
    
            const result = await response.json();
            console.log('Profile image updated successfully:', result.message);
        } catch (error) {
            console.error('Error updating profile image:', error);
            // Handle error appropriately (e.g., show error message to user)
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
                <img className="profile-image" src={profileImage || "https://via.placeholder.com/50"} alt="Profile" />
                <div className="icon-container">
                    {/* <MdModeEdit className="custom-icon" size={14} /> */}
                    <label htmlFor="file-input">
                        <MdModeEdit className="custom-icon" size={14} />
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
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

