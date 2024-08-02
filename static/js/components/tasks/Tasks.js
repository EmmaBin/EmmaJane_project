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
const shapeNames = ["Rectangle", "Sideway Rectangle", "Square", "Upper Lower Top", "Upper Lower Bottom"];

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
    const [windowNames, setWindowNames] = useState(selectedShapes.map(() => ""));

    useEffect(() => {
        setWindowNames(selectedShapes.map((_, idx) => windowNames[idx] || ""));
    }, [selectedShapes]);


    useEffect(() => {
        // Enable the "Continue" button only if all window names are filled and at least one window is selected
        const allNamesFilled = windowNames.length > 0 && windowNames.every(name => name.trim() !== "");
        setIsContinueActive(allNamesFilled);
    }, [windowNames, selectedShapes]);




    useEffect(() => {
        // Fetch tasks and members for the project
        const fetchProjectData = async () => {
            try {
                console.log(`Fetching project data for project ID: ${projectId}`);
                const response = await fetch(`/project/${projectId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched project data:', data);
                setMembers(data.members || [])
                setTasks(data.tasks || [])
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
            setWindowNames((prevNames) =>
                prevNames.filter((_, idx) => idx !== index)
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


    const handleNameChange = (index, value) => {
        setWindowNames((prevNames) => {
            const newNames = [...prevNames];
            newNames[index] = value;
            return newNames;
        });
    };

    const handleContinue = async () => {
        console.log("isContinueActive:", isContinueActive);

        if (!isContinueActive) {
            console.log("Continue button disabled; not all fields filled");
            return;
        }


        const projectData = {
            project_id: projectId,
            pname,
            address,
            tasks: selectedShapes.map((shapeIndex, i) => ({
                shapeName: shapeNames[shapeIndex],  // Use shape name
                name: windowNames[i],
                status: "Not Started"
            }))
        };

        try {
            console.log("Sending data to server:", projectData);
            const response = await fetch(`/project/${projectId}/tasks`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData),
            });

            const data = await response.json();
            console.log('Server response data:', data);

            if (!response.ok) {
                console.error('Failed to add tasks', response.status);
            }
        } catch (error) {
            console.error('Error in handleContinue:', error);
        }
    };


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
                                        <li key={task.task_id}>
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
                                        <span className="shape-name">{shapeNames[shapeIndex]}</span>
                                        <input
                                            type="text"
                                            placeholder="Name window"
                                            className="shape-input"
                                            value={windowNames[idx]}
                                            onChange={(e) => handleNameChange(idx, e.target.value)}
                                            disabled={!editMode[idx]}
                                        />
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
            <button
                className={`continue-btn ${isContinueActive ? 'active' : ''}`}
                disabled={!isContinueActive}
                onClick={handleContinue}
            >
                {isContinueActive ? 'Save' : 'Continue'}
            </button>
        </div>
    );
};

export default Tasks;
