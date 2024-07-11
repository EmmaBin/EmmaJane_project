// components/Register.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import './register.css';
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function Register() {
    const [registerInfo, setRegisterInfo] = useState({
        role: "",
        email: "",
        fname: "",
        lname: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const { team, setTeam } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsFormValid(validate());
    }, [registerInfo, team]);

    const options = ["Office", "Technician", "Client"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "team") {
            setTeam(value);
        } else {
            setRegisterInfo({ ...registerInfo, [name]: value });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(registerInfo.email)) newErrors.email = 'Invalid email';
        if (registerInfo.password.length < 5) newErrors.password = 'Invalid password';
        if (registerInfo.password !== registerInfo.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        
        const isFormComplete = registerInfo.fname && registerInfo.lname && registerInfo.role !== "" && team;
        return Object.keys(newErrors).length === 0 && isFormComplete;
    };


    let handleRegister = async (evt) => {
        evt.preventDefault();

        let newUser = await fetch("/register", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fname: registerInfo.fname,
                lname: registerInfo.lname,
                email: registerInfo.email,
                password: registerInfo.password,
                team: team,
                role: registerInfo.role
            }),
        });

        if (newUser.status === 200) {
            alert("Congratulations, your account has been created and you can now login!");
            navigate("/login");
        } else if (newUser.status === 401) {
            alert("Sorry, that email is already being used. Please try again with a different email.");
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionSelect = (value) => {
        setRegisterInfo({ ...registerInfo, role: value });
        setIsDropdownOpen(false);
    };


    return (
        <div className="container">
            <div className='register-div'>
                <h2>Register</h2>
            </div>
            <form onSubmit={handleRegister}>
                <div>
                    <label>
                        Select Role
                    </label>
                </div>
                <div className="dropdown-container">
                    <div className="dropdown-header" onClick={toggleDropdown}>
                        {registerInfo.role || "Office/Client/Technician"}
                    </div>
                    {isDropdownOpen && (
                        <div className="dropdown-list">
                            {options.map((value) => (
                                <div
                                    key={value}
                                    className="dropdown-item"
                                    onClick={() => handleOptionSelect(value)}
                                >
                                    {value}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label>Email address</label>
                </div>
                <div>
                    <input type="text"
                        id="email"
                        name="email"
                        value={registerInfo.email}
                        required={true}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your email" 
                        aria-label="Your email"
                        className={`email ${errors.email && touched.email ? 'error' : ''}`} 
                    />
                    {errors.email && touched.email && <div className="error-message email-error">{errors.email}</div>}
                </div>
                <div>
                    <label>First Name</label>
                </div>
                <div>
                    <input type="text"
                        id="fname"
                        name="fname"
                        value={registerInfo.fname}
                        required={true}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="First Name" 
                        aria-label="First Name" 
                    />
                </div>
                <div>
                    <label>Last Name</label>
                </div>
                <div>
                    <input type="text"
                        id="lname"
                        name="lname"
                        value={registerInfo.lname}
                        required={true}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Last Name" 
                        aria-label="Last Name"
                    />
                </div>
                <div>
                    <label>Password</label>
                </div>
                <div className="password-container">
                    <input type= {isPasswordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        value={registerInfo.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required={true}
                        placeholder="Your password"
                        aria-label="Your password"
                        className={`password ${errors.password && touched.password ? 'error' : ''}`}
                    />
                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                            {isPasswordVisible ? <PiEyeClosed /> : <PiEye />}
                    </span>
                </div>
                {errors.password && touched.password && <div className="error-message">{errors.password}</div>}
                <div>
                    <label>Confirm Password</label>
                </div>
                <div className="password-container">
                    <input type={isConfirmPasswordVisible ? "text" : "password"}
                        id="confirm-password"
                        name="confirmPassword"
                        value={registerInfo.confirmPassword}
                        required={true}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm your password"
                        aria-label="Confirm your password" 
                        className={`password ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
                    />
                    <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                            {isConfirmPasswordVisible ? <PiEyeClosed /> : <PiEye />}
                    </span>
                </div>
                {errors.confirmPassword && touched.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                <div>
                    <label>Team</label>
                </div>
                <div>
                    <input type="text"
                        id="team"
                        name="team"
                        required={true}
                        onChange={handleChange}
                        placeholder="Team" 
                        aria-label="Team" 
                    />
                </div>
                <button type="submit" className={`create-btn ${isFormValid ? 'active' : ''}`}>Create Account</button>
            </form>
            <div className="login">
                Already have an account? <a href="/"> Log In</a>
            </div>
        </div>

    )

}