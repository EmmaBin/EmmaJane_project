import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Include the CSS file

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/reset_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            navigate('/send_link');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsActive(e.target.value.length > 0); // Activate button when email has content
    };

    return (
        <div className="container">
            <h2>Reset password</h2>
            <p className="login-div">Enter your email and we’ll send you a link to reset your password</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Enter email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder="Your email"
                    onChange={handleEmailChange}
                    required
                    className="email"
                />
                <button
                    type="submit"
                    className={`login-btn ${isActive ? 'active' : ''}`}
                    disabled={!isActive}
                >
                    Send link to email
                </button>
            </form>
        </div>
    );
}
