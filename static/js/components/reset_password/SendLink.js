import React from 'react';
import './SendLink.css';
import { FaRegCheckCircle } from "react-icons/fa";

export default function SendLink() {
    return (
        <div className="container">
            <div className="icon-container">
                <FaRegCheckCircle className="checkmark-icon" />
            </div>
            <h2>Email sent</h2>
            <p>Check your email and open the link we sent to continue</p>
        </div>
    );
}
