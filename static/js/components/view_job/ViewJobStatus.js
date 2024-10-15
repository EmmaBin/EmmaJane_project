// TASK PAGE

import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ViewJobTask from './ViewJobTask';
import ViewJobPopUp from './ViewJobPopUp';
import './ViewJob.css';
import { AppContext } from '../../AppContext';
import rectangle from '../../../images/rectangle.png';
import sidewayRectangle from '../../../images/sideway_rectangle.png';
import square from '../../../images/square.png';
import upperLowerTop from '../../../images/upper_lower_top.png';
import upperLowerBottom from '../../../images/upper_lower_bottom.png';
import { MdModeEdit } from "react-icons/md";

const shapeImages = {
    "Rectangle": rectangle,
    "Sideway Rectangle": sidewayRectangle,
    "Square": square,
    "Upper Lower Top": upperLowerTop,
    "Upper Lower Bottom": upperLowerBottom
};

const ViewJobStatus = () => {
    const { projectId } = useParams();
    // const location = useLocation();
    // const [projectInfo, setProjectInfo] = useState([])
    // const { selectedShapes, setSelectedShapes } = useContext(AppContext);
    // const [editMode, setEditMode] = useState([]);
    // const [activeTab, setActiveTab] = useState('Windows');
    // const [tasks, setTasks] = useState([]);
    // const [members, setMembers] = useState([]);
    // const [windowNames, setWindowNames] = useState([]);
    // const [windowsOpen, setWindowsOpen] = useState(true);
    const [showPopUp, setShowPopUp] = useState(false); // For controlling the modal visibility
    // const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();

    const { state } = useLocation();
    const { task, members } = state || {};

    const getBackgroundColor = (status) => {
        switch (status) {
            case 'completed':
                return '#A8DAB8'; // Green for completed
            case 'in-progress':
                return '#FFD54F'; // Yellow for in-progress
            case 'Not Started':
                return '#AF9F9F';
            default:
                return '#AF9F9F'; // Default color
        }
    };

    // const fetchTaskData = async () => {
    //     try {
    //         console.log(`Fetching project data for project ID: ${projectId}`);
    //         const response = await fetch(`/project/${projectId}`);
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         console.log('Fetched project data:', data);
    //         setMembers(data.members || []);
    //         setTasks(data.tasks || []);
    //         setProjectInfo(data.project)
    //         setWindowNames(data.tasks.map(task => task.tname || ""));
    //         setEditMode(data.tasks.map(() => false));
    //     } catch (error) {
    //         console.error('Error fetching project data:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchProjectData();
    // }, [projectId]);

    const handleSearchNameClick = () => {
        console.log('Search Name clicked');
        setShowPopUp(true); // Open the modal
    };


    const handleClosePopUp = () => {
        console.log('Closing ViewJobPopUp');
        setShowPopUp(false); // Close the modal
        // setSelectedTask(null); // Clear the selected task
    };



    return (
        <div>
            <div className="view-job-navbar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
            <div className="tasks-container">
                <div className="header">
                    <h2>{task.tname}</h2>
                    <div className="shape-container" style={{ backgroundColor: getBackgroundColor(task.status) }}>
                        <img src={shapeImages[task.shape_name]} alt={`Selected Shape ${task.shape_name}`} />
                    </div>
                    <button
                        className="status-btn"
                    >
                        Start
                    </button>
                </div>
                <div className="assign-job">
                    <div className="search-name">
                        <summary className="summary-container" onClick={handleSearchNameClick}>
                                <div className='summary-title'>Search Name</div>
                                <span className="project-arrow"></span>
                            </summary>
                    </div>
                </div>
                <form 
                    // onSubmit={handleLogin}
                >
                    <div>
                        <div>
                            <label>Date assigned</label>
                        </div>
                        <input
                            type="text"
                            id="date_assigned"
                            name="date_assigned"
                            placeholder="Enter date to start"
                            aria-label="Date assigned"
                        />
                    </div>
                    <div>
                        <div>
                            <label>Comments</label>
                        </div>
                            <input
                                type="text"
                                id="comment"
                                name="comment"
                                placeholder="Add a comment..."
                                aria-label="Comment"
                            />
                    </div>
                    <button type="submit" className="status-btn">Post</button>
                </form>
            </div>

            {showPopUp && 
                <ViewJobPopUp 
                    task={task} 
                    members={members} 
                    onClose={handleClosePopUp} 
                />
            }
        </div>

    );
};

export default ViewJobStatus;