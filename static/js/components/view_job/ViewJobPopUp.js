import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import TaskPopUp from '../tasks/TaskPopUp';
import './ViewJob.css';
import { AppContext } from '../../AppContext';
import { MdModeEdit } from "react-icons/md";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IoMdArrowDropdown } from "react-icons/io";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ViewJobPopUp = ({ task, members = [], onClose }) => {
    const [checkedMember, setCheckedMember] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleCheckboxChange = (member) => {
        setCheckedMember((prevCheckedMember) => {
        const isChecked = prevCheckedMember.some((m) => m.user_id === member.user_id);
        if (isChecked) {
            return prevCheckedMember.filter((m) => m.user_id !== member.user_id);
        } else {
            return [...prevCheckedMember, member];
        }
        });
    };

    const isChecked = (userId) => {
        return checkedMember.some((m) => m.id === userId);
    };

    const validate = () => {
        return checkedMember.length > 0; // Ensure at least one member is checked
    };

    useEffect(() => {
        setIsFormValid(validate());
    }, [checkedMember]);

    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="assign-container">
                    <Button onClick={onClose}>Close</Button>
                    <Typography className="invite-header" id="modal-modal-title">
                        Assign Job
                    </Typography>
                    <Button 
                        className={`assign-btn ${isFormValid ? 'active' : ''}`}
                        disabled={!isFormValid}
                    >
                        Confirm
                    </Button>
                </div>
                <Box alignItems="center" sx={{ mt: 2, mb: 8 }}>
                    {members.map((member) => (
                        <Box 
                            key={member.id}
                            className="member-item"
                        >
                            <div className="member-info">
                                <Typography>{member.fname}</Typography>
                                <Typography className="lname">{member.lname}</Typography>
                            </div>
                            <Typography className="member-role">{member.role}</Typography>
                            <input 
                                className="checkbox"
                                type="checkbox" 
                                checked={isChecked(member.id)} 
                                onChange={() => handleCheckboxChange(member)} 
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Modal>
    );
};

export default ViewJobPopUp;