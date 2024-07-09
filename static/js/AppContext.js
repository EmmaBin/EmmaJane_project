import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [team, setTeam] = useState(null);


    return (
        <AppContext.Provider value={{ team, setTeam }}>
            {children}
        </AppContext.Provider>
    );
};
