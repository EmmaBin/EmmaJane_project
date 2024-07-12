import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './TasksPopUp.css';
import { IoMdArrowDropdown } from "react-icons/io";
import { AppContext } from '../../AppContext';
import rectangle from '../../../images/rectangle.png';
import sidewayRectangle from '../../../images/sideway_rectangle.png';
import square from '../../../images/square.png';
import upperLowerBottom from '../../../images/upper_lower_bottom.png';

export default function BasicModal() {
  const [shapes] = React.useState([rectangle, sidewayRectangle, square, upperLowerBottom]);
  const { selectedShapes, setSelectedShapes } = React.useContext(AppContext);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const toggleShapeSelection = (index) => {
    setSelectedShapes((prevSelectedShapes) => {
      if (prevSelectedShapes.includes(index)) {
        return prevSelectedShapes.filter((i) => i !== index);
      } else {
        return [...prevSelectedShapes, index];
      }
    });
  };

  return (
    <div>
      <Button
        className="add-members"
        onClick={handleOpen}>Add windows <IoMdArrowDropdown />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-box">
          {shapes.map((shape, index) => (
            <div
              key={index}
              className="shape-container"
              onClick={() => toggleShapeSelection(index)}
            >
              <img src={shape} alt={`Shape ${index}`} />
              {selectedShapes.includes(index) && (
                <div className="selected-overlay"></div>
              )}
            </div>
          ))}
        </Box>
      </Modal>
    </div>
  );
}
