import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function Login() {
    const [logInfo, setLogInfo] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFormValid(validate());
    }, [logInfo]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (isFormValid) {
            console.log("Logging in with:", logInfo.email, logInfo.password);
            try {
                let newUser = await fetch("/login", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: logInfo.email,
                        password: logInfo.password
                    }),
                });
                let response = await newUser.json();
                console.log("Here is the response from server", response);
                navigate('/dashboard');
            } catch (error) {
                console.error("Error during login:", error);
            }
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogInfo({ ...logInfo, [name]: value });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(logInfo.email)) newErrors.email = 'Invalid email';
        if (logInfo.password.length < 5) newErrors.password = 'Invalid password';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="container">
            <div className='login-div'>
                <h2>Log in</h2>
                {!isFormValid && isSubmitted && Object.keys(errors).length > 0 && (
                    <div className="error-message login-error">
                        Please re-check your login credentials.
                    </div>
                )}
            </div>

            <form onSubmit={handleLogin}>
                <div>
                    <div>
                        <label>Email address</label>
                    </div>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={logInfo.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your email"
                        aria-label="Email"
                        className={`email ${errors.email && touched.email ? 'error' : ''}`}
                    />
                    {errors.email && touched.email && <div className="error-message email-error">{errors.email}</div>}
                </div>
                <div>
                    <div>
                        <label>Password</label>
                    </div>
                    <div className="password-container">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={logInfo.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Your password"
                            aria-label="Password"
                            className={`password ${errors.password && touched.password ? 'error' : ''}`}
                        />
                        <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                            {isPasswordVisible ? <PiEyeClosed /> : <PiEye />}
                        </span>
                    </div>

                    {errors.password && touched.password && <div className="error-message">{errors.password}</div>}
                    <div className="forgot-password-container">
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                </div>
                <button type="submit" className={`login-btn ${isFormValid ? 'active' : ''}`}>Log in</button>
            </form>
            <div className="signup">
                I’m a new user. <a href="#"> Sign up</a>
            </div>
        </div>
    );
}


