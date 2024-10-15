// ASSIGN MEMBER TO TASK

import React, { useContext, useEffect, useState } from 'react';
import './ViewJob.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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
        console.log('Task is', task);
        return checkedMember.some((m) => m.id === userId);
    };

    const validate = () => {
        return checkedMember.length > 0; // Ensure at least one member is checked
    };

    useEffect(() => {
        setIsFormValid(validate());
        console.log('Is form valid:', isFormValid); // Log to see if it's being set correctly
    }, [checkedMember]);

    const handleAssign = async () => {
        console.log('Task ID:', task.task_id);
        console.log('Member ID:', checkedMember ? checkedMember[0].id : 'No member selected');
        try {
            // Sending a POST request to assign a member to a job
            const response = await fetch('/assign_job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task_id: task.task_id,
                    member_id: checkedMember[0].id // Only one selected member
                })
            });
    
            // Log the response status
            console.log('Response Status:', response.status);
    
            // Check if the response is successful (status code 200-299)
            if (response.ok) {
                const result = await response.json(); // Parse the response JSON
    
                // Log the response result for debugging
                console.log('Response Result:', result);
    
                // Check if the success property is true in the result
                if (result.success) {
                    console.log('Member assigned successfully!'); // Log success
                    alert('Member assigned successfully!'); // Notify user
                    setCheckedMember(null); // Clear selected member
                    onClose(); // Close the modal
                } else {
                    // Log and alert the specific error message from the server
                    console.error('Assignment error:', result.message);
                    alert(`Error: ${result.message}`);
                }
            } else {
                // If the response is not OK, attempt to read the JSON response for error messages
                const errorResult = await response.json(); // Parse the response JSON
                console.error('Failed to assign member. Status:', response.status, errorResult);
                alert(`Failed to assign member: ${errorResult.error || 'Unknown error occurred.'}`);
            }
        } catch (error) {
            // Log any errors that occurred during the fetch
            console.error('Error assigning member:', error);
            alert('An error occurred while assigning the member. Please try again.');
        }
    };
    
    

    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="assign-container">
                    <Button onClick={onClose}>Cancel</Button>
                    <Typography className="invite-header" id="modal-modal-title">
                        Assign Job
                    </Typography>
                    <Button 
                        className={`assign-btn ${isFormValid ? 'active' : ''}`}
                        disabled={!isFormValid}
                        onClick={() => {
                            console.log('Confirm button clicked'); // Debug log
                            handleAssign();
                        }}
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