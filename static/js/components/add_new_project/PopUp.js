import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AppContext } from '../../AppContext';

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

export default function BasicModal() {
  const { team } = React.useContext(AppContext);
  const [open, setOpen] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const { checkedMembers, setCheckedMembers } = React.useContext(AppContext)


  const handleOpen = async () => {
    setOpen(true);
    if (!team) {
      console.error('Team value is missing');
      return;
    }

    const fetchMembers = async () => {
      try {
        const response = await fetch(`/team_members?team=${team}`);
        if (!response.ok) {
          throw new Error(`Error fetching members: ${response.statusText}`);
        }
        const result = await response.json();
        setMembers(Object.values(result));
        console.log("Here is what was sent from the backend team", result);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMembers();
  };


  const handleClose = () => setOpen(false);

  const handleCheckboxChange = (member) => {
    setCheckedMembers((prevCheckedMembers) => {
      const isChecked = prevCheckedMembers.some((m) => m.user_id === member.user_id);
      if (isChecked) {
        return prevCheckedMembers.filter((m) => m.user_id !== member.user_id);
      } else {
        return [...prevCheckedMembers, member];
      }
    });
    console.log("!!!checked box changed", checkedMembers)
  };

  const isChecked = (userId) => {
    return checkedMembers.some((m) => m.user_id === userId);

  };

  return (
    <div>
      <Button onClick={handleOpen}>Add Members</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Invite to team
          </Typography>
          <Box sx={{ mt: 2 }}>
            {members.map((member) => (
              <Box key={member.user_id} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography>{member.fname} {member.lname}</Typography>
                <Typography>{member.role}</Typography>
                <input type="checkbox" checked={isChecked(member.user_id)}
                  onChange={() => handleCheckboxChange(member)} />
              </Box>
            ))}
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1">Invite share link</Typography>
            <input type="text" value="https://invite.jrpsystems.dsahjgka91820" readOnly style={{ width: '100%', marginBottom: '10px' }} />
            <Button variant="contained">Copy Link</Button>
          </Box>
        </Box>
      </Modal>

    </div>
  );
}