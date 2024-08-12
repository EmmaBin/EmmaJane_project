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
  // const { selectedShapes, setSelectedShapes } = React.useContext(AppContext);
    // const [currentShape, setCurrentShape] = React.useState(null);
  const { selectedShapes, setSelectedShapes, shapeQuantities, setShapeQuantities } = React.useContext(AppContext);
  const [selectedShape, setSelectedShape] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [open, setOpen] = React.useState(false);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // const addShape = (index) => {
  //   setSelectedShapes((prevSelectedShapes) => [...prevSelectedShapes, index]);
  //   setCurrentShape(index);
  // };
  const selectShape = (index) => {
    setSelectedShape(index);
    setQuantity(1);
  };

  // const removeCurrentShape = () => {
  //   setSelectedShapes((prevSelectedShapes) => prevSelectedShapes.filter((shapeIndex) => shapeIndex !== currentShape));
  //   setCurrentShape(null);
  // };

  const handleIncrement = () => {
    setQuantity(prevQuantity => Math.min(prevQuantity + 1, 20));
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  const handleAddShape = () => {
    if (selectedShape !== null) {
        // Update quantities in context
        setShapeQuantities(prevQuantities => ({
            ...prevQuantities,
            [selectedShape]: quantity
        }));
        
        setSelectedShapes(prevSelectedShapes => [
            ...prevSelectedShapes,
            ...Array(quantity).fill(selectedShape)  
        ]);
        handleClose();
    }
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
                className={`shape-container ${selectedShape === index ? 'selected' : ''}`}
                onClick={() => selectShape(index)}
              >
                <img src={shape} alt={`Shape ${index}`} />
                <div className="shape-name">{shapeNames[index]}</div>
                {selectedShape === index && (
                  <div className="selected-overlay"></div>
                )}
              </div>
            ))}
          </div>
          {/* <Button
            className="delete-button"
            onClick={removeCurrentShape}
          >
            Delete
          </Button> */}

          {selectedShape !== null && (
            <div className="quantity-container">
              <label htmlFor="quantity-input">Quantity:</label>
              <div className="custom-spinner">
                <button onClick={handleDecrement} className="decrement-button">-</button>
                <span className="quantity-display">{quantity}</span>
                <button onClick={handleIncrement} className="increment-button">+</button>
              </div>
              <Button onClick={handleAddShape}>Add</Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
