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
    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography className="invite-header" id="modal-modal-title">
                    Assign Job
                </Typography>
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
                        </Box>
                    ))}
                </Box>
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default ViewJobPopUp;