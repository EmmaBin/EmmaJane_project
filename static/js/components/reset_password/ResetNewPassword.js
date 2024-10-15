import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PiEye, PiEyeClosed } from "react-icons/pi";
import './ResetNewPassword.css';

const ResetNewPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        console.log('ResetNewPassword component has mounted, token:', token);
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }


        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`/reset_password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage('Password has been reset successfully.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.error || 'An error occurred. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="reset-password-container">
            <h2>Reset password</h2>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="input-container">
                    <label>Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={togglePasswordVisibility} className="icon">
                            {showPassword ? <PiEyeClosed /> : <PiEye />}
                        </span>
                    </div>
                </div>
                <div className="input-container">
                    <label>Confirm password</label>
                    <div className="input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span onClick={toggleConfirmPasswordVisibility} className="icon">
                            {showConfirmPassword ? <PiEyeClosed /> : <PiEye />}
                        </span>
                    </div>
                </div>
                <button type="submit" className="submit-btn">Save</button>
            </form>
        </div>
    );
};

export default ResetNewPassword;

