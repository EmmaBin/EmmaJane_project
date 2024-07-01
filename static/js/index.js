// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';


import Login from './components/login/Login';
import Register from './components/Register';

const root = createRoot(document.getElementById('main'));

function App() {
    return (
        <div>
            {/* <h1>Hello, world!</h1> */}
            <Login />
            {/* Add more components here */}
            {/* <Register /> */}
        </div>
    );
}

root.render(<App />);
