// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';

<<<<<<< Updated upstream
import Login from './components/Login';
import Register from './components/Register';
=======
import Login from './components/login/Login';
>>>>>>> Stashed changes

const root = createRoot(document.getElementById('main'));

function App() {
    return (
        <div>
            {/* <h1>Hello, world!</h1> */}
            <Login />
            {/* Add more components here */}
            <Register />
        </div>
    );
}

root.render(<App />);
