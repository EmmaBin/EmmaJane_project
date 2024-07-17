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

    useEffect(() => {
        // Check if selectedShapes is not empty to enable Continue button
        setIsContinueActive(selectedShapes.length > 0);
    }, [selectedShapes]);

    // const toggleEditMode = (index) => {
    //     setEditMode((prevEditMode) => {
    //         const newEditMode = [...prevEditMode];
    //         newEditMode[index] = !newEditMode[index];
    //         return newEditMode;
    //     });
    // };

    const toggleEditMode = (index, isDelete = false) => {
        if (isDelete) {
            // Handle delete operation
            setSelectedShapes((prevSelectedShapes) =>
                prevSelectedShapes.filter((_, idx) => idx !== index)
            );

            setEditMode((prevEditMode) =>
                prevEditMode.filter((_, idx) => idx !== index)
            );
        } else {
            // Toggle edit mode
            setEditMode((prevEditMode) => {
                const newEditMode = [...prevEditMode];
                newEditMode[index] = !newEditMode[index];
                return newEditMode;
            });
        }
    };

    return (
        <div className="tasks-container">
            <div className="header">
                <h2>{pname}</h2>
                <div className="icon-container">
                    <MdModeEdit className="custom-icon" size={14} />
                </div>
                <h3>{address}</h3>
            </div>
            <div className="window-section">
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
            <button className={`continue-btn ${isContinueActive ? 'active' : ''}`} disabled={!isContinueActive}>
                Continue
            </button>
            <div className="continue-container">
                <button className="continue-btn">Continue</button>
            </div>
        </div>
    );
};

export default Tasks;
