import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TaskPopUp from './TaskPopUp';
import './Tasks.css';

const Tasks = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const { pname, address } = location.state || {};

    return (
        <div>
            <h2>{pname}</h2>
            <h3>{address}</h3>
            

            <div>
                    <div>
                        <label>Team</label>
                        <TaskPopUp />
                    </div>

            </div>
        </div>
    );
};

export default Tasks;