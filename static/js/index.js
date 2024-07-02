// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './components/profile/Profile';


import Login from './components/login/Login';
import Register from './components/register/Register';

const root = createRoot(document.getElementById('main'));

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Profile />} />
            </Routes>
        </Router>
        // <div>
        //     {/* <h1>Hello, world!</h1> */}
        //     {/* <Login /> */}
        //     {/* Add more components here */}
        //     <Register />
        // </div>
    );
}

root.render(<App />);








