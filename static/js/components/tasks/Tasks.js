import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TaskPopUp from './TaskPopUp';
import { AppContext } from '../../AppContext';
import './Tasks.css';
import rectangle from '../../../images/rectangle.png';
import sidewayRectangle from '../../../images/sideway_rectangle.png';
import square from '../../../images/square.png';
import upperLowerTop from '../../../images/upper_lower_top.png';
import upperLowerBottom from '../../../images/upper_lower_bottom.png';
import { MdModeEdit } from "react-icons/md";

const shapes = [rectangle, sidewayRectangle, square, upperLowerTop, upperLowerBottom];

const Tasks = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const { pname, address } = location.state || {};
    const { selectedShapes, setSelectedShapes } = useContext(AppContext);
    const [editMode, setEditMode] = useState(selectedShapes.map(() => false));
    const [isContinueActive, setIsContinueActive] = useState(false);
    const [activeTab, setActiveTab] = useState('Windows');
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // Check if selectedShapes is not empty to enable Continue button
        setIsContinueActive(selectedShapes.length > 0);
    }, [selectedShapes]);

    // useEffect(() => {
    //     // Fetch tasks for the project
    //     const fetchTasks = async () => {
    //         try {
    //             const response = await fetch(`/project/${projectId}`);
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }
    //             const data = await response.json();
    //             console.log('Fetched tasks:', data); // Debugging line
    //             setTasks(Array.isArray(data) ? data : []);
    //         } catch (error) {
    //             console.error('Error fetching tasks:', error);
    //         }
    //     };
        
    //     fetchTasks();
    // }, [projectId]);

    useEffect(() => {
        // Fetch tasks and members for the project
        const fetchProjectData = async () => {
            try {
                const response = await fetch(`/project/${projectId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched project data:', data); // Debugging line
                setTasks(data.tasks || []);
                setMembers(data.members || []);
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };
    
        fetchProjectData();
    }, [projectId]);


    const toggleEditMode = (index, isDelete = false) => {
        if (isDelete) {
            setSelectedShapes((prevSelectedShapes) =>
                prevSelectedShapes.filter((_, idx) => idx !== index)
            );
    
            setEditMode((prevEditMode) =>
                prevEditMode.filter((_, idx) => idx !== index)
            );
        } else {
            setEditMode((prevEditMode) => {
                const newEditMode = [...prevEditMode];
                newEditMode[index] = !newEditMode[index];
                return newEditMode;
            });
        }
    };

    // const toggleEditMode = (index, isDelete = false) => {
    //     if (isDelete) {
    //         // Handle delete operation
    //         setSelectedShapes((prevSelectedShapes) =>
    //             prevSelectedShapes.filter((_, idx) => idx !== index)
    //         );

    //         setEditMode((prevEditMode) =>
    //             prevEditMode.filter((_, idx) => idx !== index)
    //         );
    //     } else {
    //         // Toggle edit mode
    //         setEditMode((prevEditMode) => {
    //             const newEditMode = [...prevEditMode];
    //             newEditMode[index] = !newEditMode[index];
    //             return newEditMode;
    //         });
    //     }
    // };

    return (
        <div className="tasks-container">
            <div className="nav">
                <button
                    className={`nav-button ${activeTab === 'Windows' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Windows')}
                >
                    Windows
                </button>
                <button
                    className={`nav-button ${activeTab === 'Teams' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Teams')}
                >
                    Teams
                </button>
            </div>

            {activeTab === 'Windows' ? (
                <div className="window-section">
                    <div className="header">
                        <h2>{pname}</h2>
                        <div className="icon-container">
                            <MdModeEdit className="custom-icon" size={14} />
                        </div>
                        <h3>{address}</h3>
                    </div>


                    <div className="tasks">
                        <div className="current-tasks">
                            <details>
                                <summary className="summary-container">
                                    <div className='summary-title'>Current Windows</div>
                                    <span className="project-arrow"></span>
                                </summary>

                                <ul>
                                    {tasks.map((task) => (
                                        <li key={task.id}>
                                            <div className="task-info">
                                                <div className="task-details">
                                                    <div className="task-title">{task.tname}</div>
                                                    <div className="task-assigned">{task.date_assigned}</div>
                                                    <div className="task-status">{task.status}</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                    </div>





                    <div className="window-header">
                        <label>Windows</label>
                        <TaskPopUp />
                    </div>
                    <div className="selected-shapes">
                        {selectedShapes.map((shapeIndex, idx) => (
                            <div key={idx} className="shape-item">
                                <div className="shape-container">
                                    <img src={shapes[shapeIndex]} alt={`Selected Shape ${shapeIndex}`} />
                                    <MdModeEdit className="edit-icon custom-icon" size={14} />
                                </div>
                                <div className="shape-details">
                                    <div className="shape-info">
                                        <span className="shape-name">Rectangle</span>
                                        <input type="text" placeholder="Name window" className="shape-input" disabled={!editMode[idx]} />
                                    </div>
                                    <div className="shape-actions">
                                        {editMode[idx] ? (
                                            <>
                                                <button className="cancel-btn" onClick={() => toggleEditMode(idx)}>Cancel</button>
                                                <button className="save-btn" onClick={() => toggleEditMode(idx)}>Save</button>
                                                <button className="delete-btn" onClick={() => toggleEditMode(idx, true)}>Delete</button>
                                            </>
                                        ) : (
                                            <button className="edit-btn" onClick={() => toggleEditMode(idx)}>Edit</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="teams-section">
                    <h2>Teams Section</h2>
                    <ul>
                        {members.map((member) => (
                            <li key={member.id}>
                                <div className="member-info">
                                    <div className="member-details">
                                        <div className="member-name">{member.fname} {member.lname}</div>
                                        <div className="member-email">{member.email}</div>
                                        <div className="member-team">{member.team}</div>
                                        <div className="member-role">{member.role}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button className={`continue-btn ${isContinueActive ? 'active' : ''}`} disabled={!isContinueActive}>
                Continue
            </button>
        </div>
    );
};

export default Tasks;
