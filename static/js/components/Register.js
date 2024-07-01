// components/Register.js
import React, { useState } from 'react';

export default function Register() {
    const [fname, setFName] = React.useState("");
    const [lname, setLName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("")
    const [team, setTeam] = React.useState("");
    const [role, setRole] = React.useState("");

    // const handleLogin = (e) => {
    //     e.preventDefault();
    //     console.log("Logging in with:", email, password);

    // Requires password
    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
      });

    const options = ["Select role", "Office", "Technician", "Client"];

    let handleSubmit = async (evt) => {
        evt.preventDefault();

        let newUser = await fetch("/register", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                fname: fname,
                lname: lname,
                email: email,
                password: password,
                team: team,
                role: role,
            }),
        });

        if(newUser.status===200){
            alert("Congratulations, your account has been created and you can now login!");
            location.reload();

        } else if (newUser.status===401) {
            alert("Sorry, that email is already being used. Please try again with a different email.");
            location.reload();

        }
    };


    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>
                    <input type="text"  
                        id="fname" 
                        name="fname" 
                        required={true} 
                        onChange={(evt) => setFName(evt.target.value)}
                        placeholder="First Name" aria-label="First Name" />
                </div>
                <div>
                    <label>Last Name</label>
                    <input type="text" 
                        id="lname"
                        name="lname" 
                        required={true} 
                        onChange={(evt) => setLName(evt.target.value)}
                        placeholder="Last Name" aria-label="Last Name"  />
                </div>
                <div>
                    <label>Email address</label>
                    <input type="text" 
                        id="email"
                        name="email" 
                        required={true} 
                        onChange={(evt) => setEmail(evt.target.value)}
                        placeholder="Your email" aria-label="Your email" />
                </div>
                <div>
                    <label>Password</label>
                    <input type={values.showPassword ? "text" : "password"} 
                        id="password" 
                        name="password" 
                        required={true} 
                        onChange={(evt) => setPassword(evt.target.value)}
                        placeholder="Your password" aria-label="Your password" />
                </div>
                <div>
                    <label>
                        Role:
                        <select 
                            id="role"
                            value={role} 
                            required={true} 
                            onChange={(evt) => setRole(evt.target.value)}>
                            {options.map((value) => (
                            <option value={value} key={value}>
                                {value}
                            </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <input type="text"
                        id="team"
                        name="team" 
                        hidden={ role === 'Client' || role === '' ? true : false } 
                        required={ role !== 'Client' ? true : false } 
                        onChange={(evt) => setTeam(evt.target.value)}
                        placeholder="Team" aria-label="Team"  />
                </div>
                <input type="submit" value="Submit" />
                {/* <ReactRouterDOM.Link to='/login'>Login</ReactRouterDOM.Link> */}
            </form>
        </div>

    )
    
}