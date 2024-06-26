// components/Login.js
import React, { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with:", email, password);
        // Implement your login logic here, e.g., send login request to server
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email address</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        aria-label="Email"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        aria-label="Password"
                    />
                </div>
                <div>
                    <input type="submit" value="Submit" />
                    {/* Example of using React Router Link */}
                    {/* <ReactRouterDOM.Link to='/create'>I'm a new user. Sign up</ReactRouterDOM.Link> */}
                </div>
            </form>
        </div>
    );
}
