import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [team, setTeam] = useState(null);
    const [checkedMembers, setCheckedMembers] = useState([])


    return (
        <AppContext.Provider value={{ team, setTeam, checkedMembers, setCheckedMembers }}>
            {children}
        </AppContext.Provider>
    );
};
