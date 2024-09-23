import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const NewPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/verify_token/${token}`);
                const data = await response.json();

                if (data.valid) {
                    setTokenValid(true);
                } else {
                    setError(data.error || 'Invalid or expired token.');
                    setTokenValid(false);
                }
            } catch (err) {
                setError('An error occurred while verifying the token.');
                setTokenValid(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/reset_password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, password })
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

    if (!tokenValid) {
        return <div>{error ? <p style={{ color: 'red' }}>{error}</p> : <p>Verifying token...</p>}</div>;
    }

    return (
        <div>
            <h2>Reset Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default NewPassword;
