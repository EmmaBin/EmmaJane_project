import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUp from './PopUp';
import './NewProject.css';
import { AppContext } from '../../AppContext';


const NewProject = () => {
    const { checkedMembers, setCheckedMembers } = React.useContext(AppContext);
    // const { fname } = useParams();
    const [isFormValid, setIsFormValid] = useState(false);
    const [projectInfo, setProjectInfo] = React.useState({
        pname: "",
        address: ""
    });
    const navigate = useNavigate();
    // const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    const handleRemove = (userId) => {
        setCheckedMembers((prevCheckedMembers) =>
            prevCheckedMembers.filter((member) => member.user_id !== userId)
        );
    };

    const validate = () => {
        return projectInfo.pname.trim() !== '' && projectInfo.address.trim() !== '' && checkedMembers.length > 0;
    };

    useEffect(() => {
        setIsFormValid(validate());
    }, [projectInfo, checkedMembers]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectInfo({ ...projectInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/project", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pname: projectInfo.pname,
                    address: projectInfo.address,
                    members: checkedMembers
                }),
            });


            if (response.ok) {
                const data = await response.json(); // Await here to get JSON data
                const projectId = data.project_id;
                setCheckedMembers([]);
                navigate(`/project/${projectId}`, {
                    state: {
                        projectId,
                        pname: projectInfo.pname,
                        address: projectInfo.address
                    }
                });
            } else {
                console.error('Failed to add new project');
                return Promise.reject('Failed to add new project');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // const handleAddMembers = (e) => {
    //     e.preventDefault();
    //     console.log(projectInfo.pname, projectInfo.address);
    //     setIsPopUpOpen(true);
    // };

    return (
        <div>

            <div className="navbar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
            <div className="header">
                <div className="header-content">
                    <h2>Add new project</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Job name</label>
                </div>
                <div>
                    <input type="text"
                        id="pname"
                        name="pname"
                        required={true}
                        value={projectInfo.pname}
                        onChange={handleChange}
                        placeholder="Your project name"
                        aria-label="Your project name"
                    />
                </div>
                <div>
                    <label>Job Address</label>
                </div>
                <div>
                    <input type="text"
                        id="address"
                        name="address"
                        required={true}
                        value={projectInfo.address}
                        onChange={handleChange}
                        placeholder="Project address"
                        aria-label="Project address"
                    />
                </div>
                <div className="team">
                    <label>Team</label>
                    <PopUp />
                </div>

                {checkedMembers && checkedMembers.length > 0 &&
                    checkedMembers.map((member) => (
                        <div className="member-item" key={member.user_id}>
                            <div>
                                <div className="member-info">
                                    <div>{member.fname}</div>
                                    <div className="lname">{member.lname}</div>
                                </div>
                                <div className="member-role">{member.role}</div>
                            </div>
                            <button
                                className="remove-button"
                                onClick={() => handleRemove(member.user_id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                }

                <button
                    type="submit"
                    className={`continue-btn ${isFormValid ? 'active' : ''}`}
                    disabled={!isFormValid}
                >
                    Continue
                </button>

            </form>

        </div>
    );
};

export default NewProject;
