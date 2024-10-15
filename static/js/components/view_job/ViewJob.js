import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import TaskPopUp from '../tasks/TaskPopUp';
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

const ViewJob = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const [projectInfo, setProjectInfo] = useState([])
    const { selectedShapes, setSelectedShapes } = useContext(AppContext);
    const [editMode, setEditMode] = useState([]);
    const [activeTab, setActiveTab] = useState('Windows');
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [windowNames, setWindowNames] = useState([]);
    const [windowsOpen, setWindowsOpen] = useState(true);
    const [showPopUp, setShowPopUp] = useState(false); // For controlling the modal visibility
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();

    const fetchProjectData = async () => {
        try {
            console.log(`Fetching project data for project ID: ${projectId}`);
            const response = await fetch(`/project/${projectId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched project data:', data);
            setMembers(data.members || []);
            setTasks(data.tasks || []);
            setProjectInfo(data.project)
            setWindowNames(data.tasks.map(task => task.tname || ""));
            setEditMode(data.tasks.map(() => false));
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

    const toggleWindowsOpen = () => {
        setWindowsOpen(prev => !prev);
    };

    const toggleEditMode = (index) => {
        setEditMode((prevEditMode) => {
            const newEditMode = [...prevEditMode];
            newEditMode[index] = !newEditMode[index];
            console.log(editMode)
            return newEditMode;
        });
    };

    const handleNameChange = (index, value) => {
        setWindowNames((prevNames) => {
            const newNames = [...prevNames];
            newNames[index] = value;
            return newNames;
        });
    };

    const handleUpdate = async (index) => {
        const taskId = tasks[index].task_id;

        const taskData = {
            task_id: taskId,
            project_id: projectId,
            tname: windowNames[index],
            status: tasks[index].status
        };

        try {
            console.log("Updating task on server:", taskData);
            const response = await fetch(`/project/${projectId}/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData),
            });

            const data = await response.json();
            console.log('Server response data:', data);

            if (!response.ok) {
                console.error('Failed to update task', response.status);
            } else {
                toggleEditMode(index); // Exit edit mode after successful update
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (index) => {
        const taskId = tasks[index].task_id;

        try {
            console.log(`Deleting task ${taskId} on server`);
            const response = await fetch(`/project/${projectId}/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Server response data:', data);

            if (!response.ok) {
                console.error('Failed to delete task', response.status);
            } else {
                setTasks((prevTasks) => prevTasks.filter((_, idx) => idx !== index));
                setSelectedShapes((prevSelectedShapes) => prevSelectedShapes.filter((_, idx) => idx !== index));
                setWindowNames((prevNames) => prevNames.filter((_, idx) => idx !== index));
                setEditMode((prevEditMode) => prevEditMode.filter((_, idx) => idx !== index));
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleDeleteMember = async (memberId) => {
        // Confirm before deletion
        const confirmed = window.confirm('Are you sure you want to remove this member?');
        if (!confirmed) return;

        try {
            console.log(`Deleting member ${memberId} from project ${projectId} on server`);
            const response = await fetch(`/project/${projectId}/member/${memberId}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Server response data:', data);

            if (!response.ok) {
                console.error('Failed to delete member', response.status);
            } else {
                setMembers((prevMembers) => prevMembers.filter(member => member.id !== memberId));
            }
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const handleEditPname = () => {
        navigate(`/project/${projectId}/edit_pname`, {
            state: {
                projectId,
                pname: projectInfo.pname,
                address: projectInfo.address
            }
        });
    };

    const handleImageClick = (task) => {
        if (!windowsOpen) {
            console.log('Task selected:', task);
            setSelectedTask(task);
            setShowPopUp(true);
            navigate(`/project/${projectId}/${task.task_id}`, {
                state: {
                    // dateAssigned: task.date_assigned,
                    // tname: task.tname,
                    // shapeName: task.shape_name,
                    // status: task.status,
                    // taskId: task.task_id,
                    task: task,
                    members: members
                }
            });
        }
    };
    
    

    // const handleClosePopUp = () => {
    //     console.log('Closing ViewJobPopUp');
    //     setShowPopUp(false); // Close the modal
    //     setSelectedTask(null); // Clear the selected task
    // };

    const handleTaskAdd = async () => {
        await fetchProjectData(); // Fetch the updated project data
    };
    

    return (
        <div>
            <div className="view-job-navbar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
                <ViewJobTask onTaskAdd={handleTaskAdd} />
            </div>
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
                        Team
                    </button>
                </div>

                {activeTab === 'Windows' ? (
                    <div className="window-section">
                        <div className="header">
                            <h2>{projectInfo && projectInfo.pname}
                                <div className="icon-container">
                                    <MdModeEdit className="custom-icon" size={14} onClick={handleEditPname} />
                                </div>
                            </h2>

                            <h3>{projectInfo && projectInfo.address}</h3>
                        </div>

                        <div className="tasks">
                            <div className="current-tasks">

                                <summary className="summary-container" onClick={toggleWindowsOpen}>
                                    <div className='summary-title'>Windows</div>
                                    <span>{windowsOpen ? 'Hide' : 'Open'}</span>
                                </summary>

                                <ul>
                                    {tasks.map((task, idx) => (
                                        <li key={task.task_id} className="shape-item">
                                            <div 
                                                className="shape-container"
                                                onClick={() => handleImageClick(task)}
                                                style={{ cursor: !windowsOpen ? 'pointer' : 'default' }}
                                            >
                                                <img src={shapeImages[task.shape_name]} alt={`Selected Shape ${task.shape_name}`} />
                                            </div>
                                            <div className="shape-details">
                                                <div className="shape-info">
                                                    <span className="shape-name">{task.shape_name}</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Name window"
                                                        className="shape-input"
                                                        value={windowNames[idx]}
                                                        onChange={(e) => handleNameChange(idx, e.target.value)}
                                                        disabled={!editMode[idx]}
                                                    />
                                                </div>
                                                {windowsOpen && (
                                                    <div className="shape-actions">
                                                        {editMode[idx] ? (
                                                            <>
                                                                <button className="save-btn" onClick={() => handleUpdate(idx)}>Save</button>
                                                                <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
                                                                <button className="cancel-btn" onClick={() => toggleEditMode(idx)}>Cancel</button>
                                                            </>
                                                        ) : (
                                                            <button className="edit-btn" onClick={() => toggleEditMode(idx)}>Edit</button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>


                    </div>
                ) : (
                    <div className="teams-section">
                        <div className="team-header">
                            <h2>Team</h2>
                            <a className="add-members-link">Add members ▾</a>
                        </div>

                        <ul>
                            {members.map((member) => (
                                <li key={member.id} className="member-info">
                                    <div className="member-details">
                                        <div className="member-name">{member.fname} {member.lname}</div>
                                        <div className="member-team">{member.role}</div>
                                    </div>
                                    <button className="remove-btn" onClick={() => handleDeleteMember(member.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {/* {showPopUp && (
                <>
                    <ViewJobPopUp 
                        task={selectedTask} 
                        members={members} 
                        onClose={handleClosePopUp} 
                    />
                </>
            )} */}
        </div>

    );
};

export default ViewJob;