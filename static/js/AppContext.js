import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [team, setTeam] = useState(null);
    const [checkedMembers, setCheckedMembers] = useState([])
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [shapeQuantities, setShapeQuantities] = useState({})


    return (
        <AppContext.Provider value={{ team, setTeam, checkedMembers, setCheckedMembers, selectedShapes, setSelectedShapes, shapeQuantities, setShapeQuantities }}>
            {children}
        </AppContext.Provider>
    );
};
