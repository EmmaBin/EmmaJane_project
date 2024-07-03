// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileCard from './components/profile/ProfileCard';


import Login from './components/login/Login';
import Register from './components/register/Register';
import NewProject from './components/add_new_project/NewProject'

const root = createRoot(document.getElementById('main'));

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProfileCard />} />
                <Route path="/:fname/add_new_project" element={<NewProject />} />
            </Routes>
        </Router>
    );
}

root.render(<App />);








