// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileCard from './components/profile/ProfileCard';


import Login from './components/login/Login';
import Register from './components/register/Register';
import NewProject from './components/add_new_project/NewProject'
import Tasks from './components/tasks/Tasks'
import ViewJob from './components/view_job/ViewJob'
import EditPname from './components/tasks/EditPname';
import { AppProvider } from './AppContext';
import ResetPassword from './components/reset_password/Reset';
import SendLink from './components/reset_password/SendLink';
const root = createRoot(document.getElementById('main'));

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProfileCard />} />
                <Route path="/:fname/project" element={<NewProject />} />
                <Route path="/project/:projectId" element={<Tasks />} />
                <Route path="/project/:projectId/view_job" element={<ViewJob />} />
                <Route path="/project/:projectId/edit_pname" element={<EditPname />} />
                <Route path="/reset_password" element={<ResetPassword />} />
                <Route path="/send_link" element={<SendLink />} />

            </Routes>
        </Router>
    );
}

root.render(
    <AppProvider>
        <App />
    </AppProvider>
);








