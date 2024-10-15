// ADD WINDOW FEATURE

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import '../tasks/TasksPopUp.css';
import { IoMdArrowDropdown } from "react-icons/io";
import { AppContext } from '../../AppContext';
import rectangle from '../../../images/rectangle.png';
import sidewayRectangle from '../../../images/sideway_rectangle.png';
import square from '../../../images/square.png';
import upperLowerTop from '../../../images/upper_lower_top.png';
import upperLowerBottom from '../../../images/upper_lower_bottom.png';

export default function BasicModal({ onTaskAdd }) {
  const [shapes] = React.useState([rectangle, sidewayRectangle, square, upperLowerTop, upperLowerBottom]);
  const { projectId } = useParams();
  const [shapeNames] = React.useState(['Rectangle', 'Sideway Rectangle', 'Square', 'Upper Lower Top', 'Upper Lower Bottom']);
  // const { selectedShapes, setSelectedShapes } = React.useContext(AppContext);
    // const [currentShape, setCurrentShape] = React.useState(null);
  const { selectedShapes, setSelectedShapes, shapeQuantities, setShapeQuantities } = React.useContext(AppContext);
  const [selectedShape, setSelectedShape] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [windowNames, setWindowNames] = useState(selectedShapes.map(() => ""));
  const [open, setOpen] = React.useState(false);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const selectShape = (index) => {
    setSelectedShape(index);
    setQuantity(1);
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => Math.min(prevQuantity + 1, 20));
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  const handleAdd = async () => {
    if (selectedShape !== null) {
        // Update quantities in context
        setShapeQuantities(prevQuantities => ({
            ...prevQuantities,
            [selectedShape]: quantity
        }));
        
        // Update selected shapes in context and construct project data afterwards
        const updatedSelectedShapes = [
            ...selectedShapes,
            ...Array(quantity).fill(selectedShape)  
        ];
        
        setSelectedShapes(updatedSelectedShapes); // This won't immediately reflect in selectedShapes

        const projectData = {
            project_id: projectId,
            tasks: updatedSelectedShapes.map((shapeIndex, i) => ({
                shapeName: shapeNames[shapeIndex],  
                name: windowNames[i], // Ensure windowNames is defined
                quantity: shapeQuantities[shapeIndex] || 1,
                status: "Not Started"
            }))
        };

        // Now send projectData to the server
        try {
            console.log("Sending data to server:", projectData);
            const response = await fetch(`/project/${projectId}/tasks`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData),
            });

            const data = await response.json();
            console.log('Server response data:', data);
            handleClose();

            if (response.ok) {
                // Task added successfully
                onTaskAdd(); // Call the callback to notify the parent component
            }
        } catch (error) {
            console.error('Error in handleContinue:', error);
        }
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
                <div className="image-container">
                  <img src={shape} alt={`Shape ${index}`} />
                  {selectedShape === index && (
                    <div className="selected-overlay"></div>
                  )}
                </div>
                <div className="shape-name">{shapeNames[index]}</div>
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
              <Button onClick={handleAdd}>Add</Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
