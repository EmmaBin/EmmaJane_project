import React, { useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TaskPopUp from './TaskPopUp';
import { AppContext } from '../../AppContext';
import './Tasks.css';
import rectangle from '../../../images/rectangle.png';
import sidewayRectangle from '../../../images/sideway_rectangle.png';
import square from '../../../images/square.png';
import upperLowerBottom from '../../../images/upper_lower_bottom.png';
import { MdModeEdit } from "react-icons/md";

const shapes = [rectangle, sidewayRectangle, square, upperLowerBottom];

const Tasks = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const { pname, address } = location.state || {};
    const { selectedShapes } = useContext(AppContext);
    const [editMode, setEditMode] = useState(selectedShapes.map(() => false));

    const toggleEditMode = (index) => {
        setEditMode((prevEditMode) => {
            const newEditMode = [...prevEditMode];
            newEditMode[index] = !newEditMode[index];
            return newEditMode;
        });
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
            <div className="continue-container">
                <button className="continue-btn">Continue</button>
            </div>
        </div>
    );
};

export default Tasks;
