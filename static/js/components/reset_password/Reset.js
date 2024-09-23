import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


export default function ResetPassword() {
    const [email, setEmail] = React.useState("")
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
    return (
        <>
            <h1>Reset password</h1>

            <h3>Enter your email and we’ll send you a link to reset your password</h3>

            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Email:</label>
                <input type="email" value={email} id="email" onChange={(e) => setEmail(e.target.value)} required>
                </input>

                <button type="submit">Send link to email</button>
            </form>


        </>
    )
}