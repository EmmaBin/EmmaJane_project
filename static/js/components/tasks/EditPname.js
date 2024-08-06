import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './EditPname.css';

export default function EditPname() {
    const location = useLocation();
    const { projectId, pname: initialPname, address: initialAddress } = location.state || {};

    const [pname, setPname] = useState(initialPname);
    const [address, setAddress] = useState(initialAddress);
    const [isChanged, setIsChanged] = useState(false);

    const handleNameChange = (e) => {
        setPname(e.target.value);
        setIsChanged(true);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
        setIsChanged(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/project/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pname, address })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`Project updated successfully: ${data}`);
                setIsChanged(false); // Reset the change flag
            } else {
                console.error('Failed to update project');
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <div className="edit-pname-container">
            <h1>Edit name</h1>
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label>Job name</label>
                    <input
                        type="text"
                        value={pname}
                        onChange={handleNameChange}
                    />
                </div>

                <div className="form-group">
                    <label>Job address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={handleAddressChange}
                    />
                </div>

                <button type="submit" disabled={!isChanged} className={`save-button ${isChanged ? 'active' : ''}`}>
                    Save
                </button>
            </form>
        </div>
    );
}
