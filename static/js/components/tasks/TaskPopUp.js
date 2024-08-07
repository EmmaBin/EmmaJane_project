import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import './TasksPopUp.css';
import { IoMdArrowDropdown } from "react-icons/io";
import { AppContext } from '../../AppContext';
import rectangle from '../../../images/rectangle.png';
import sidewayRectangle from '../../../images/sideway_rectangle.png';
import square from '../../../images/square.png';
import upperLowerTop from '../../../images/upper_lower_top.png';
import upperLowerBottom from '../../../images/upper_lower_bottom.png';

export default function BasicModal() {
  const [shapes] = React.useState([rectangle, sidewayRectangle, square, upperLowerTop, upperLowerBottom]);
  const [shapeNames] = React.useState(['Rectangle', 'Sideway Rectangle', 'Square', 'Upper Lower Top', 'Upper Lower Bottom']);
  const { selectedShapes, setSelectedShapes } = React.useContext(AppContext);
  const [open, setOpen] = React.useState(false);
  const [currentShape, setCurrentShape] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const addShape = (index) => {
    setSelectedShapes((prevSelectedShapes) => [...prevSelectedShapes, index]);
    setCurrentShape(index);
  };

  const removeCurrentShape = () => {
    setSelectedShapes((prevSelectedShapes) => prevSelectedShapes.filter((shapeIndex) => shapeIndex !== currentShape));
    setCurrentShape(null);
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
          <div className="shapes-container">
            {shapes.map((shape, index) => (
              <div
                key={index}
                className={`shape-container ${selectedShapes.includes(index) ? 'selected' : ''}`}
                onClick={() => addShape(index)}
              >
                <img src={shape} alt={`Shape ${index}`} />
                <div className="shape-name">{shapeNames[index]}</div>
                {selectedShapes.includes(index) && (
                  <div className="selected-overlay"></div>
                )}
              </div>
            ))}
          </div>
          <Button
            className="delete-button"
            onClick={removeCurrentShape}
          >
            Delete
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
