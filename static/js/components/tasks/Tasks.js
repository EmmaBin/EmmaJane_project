import React, { useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TaskPopUp from './TaskPopUp';
import { AppContext } from '../../AppContext';
import './Tasks.css';
import rectangle from '../../../images/rectangle.png';
import sidewayRectangle from '../../../images/sideway_rectangle.png';
import square from '../../../images/square.png';
import upperLowerBottom from '../../../images/upper_lower_bottom.png';

const shapes = [rectangle, sidewayRectangle, square, upperLowerBottom];

const Tasks = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const { pname, address } = location.state || {};
    const { selectedShapes, setSelectedShapes } = useContext(AppContext);
    const [editMode, setEditMode] = useState(selectedShapes.map(() => false));

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
                            <img src={shapes[shapeIndex]} alt={`Selected Shape ${shapeIndex}`} />
                            <div className="shape-details">
                                <span className="shape-name">Rectangle</span>
                                <input type="text" placeholder="Name window" className="shape-input" disabled={!editMode[idx]} />
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
            <button className="continue-btn">Continue</button>
        </div>
    );
};

export default Tasks;
