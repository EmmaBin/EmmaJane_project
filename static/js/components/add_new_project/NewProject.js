import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PopUp from './PopUp';
import { AppContext } from '../../AppContext';


const NewProject = () => {
    const { checkedMembers, setCheckedMembers } = React.useContext(AppContext);
    const { fname } = useParams();
    const [projectInfo, setProjectInfo] = React.useState({
        pname: "",
        address: ""
    });
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    const handleRemove = (userId) => {
        setCheckedMembers((prevCheckedMembers) =>
            prevCheckedMembers.filter((member) => member.user_id !== userId)
        );
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectInfo({ ...projectInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(projectInfo.pname, projectInfo.address);
        console.log("get from new project component", checkedMembers);

        try {
            await fetch("/add_new_project", {
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
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddMembers = (e) => {
        e.preventDefault();
        console.log(projectInfo.pname, projectInfo.address);
        setIsPopUpOpen(true);
    };

    return (
        <div>
            <h1>Add new project for {fname}</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Job name</label>
                    <input type="text"
                        id="pname"
                        name="pname"
                        required={true}
                        value={projectInfo.pname}
                        onChange={handleChange}
                        placeholder="Your project name" aria-label="Your project name" />
                </div>
                <div>
                    <label>Job Address</label>
                    <input type="text"
                        id="address"
                        name="address"
                        required={true}
                        value={projectInfo.address}
                        onChange={handleChange}
                        placeholder="Project address" aria-label="Project address" />
                </div>
                <div>
                    <label>Team</label>
                    <PopUp />

                </div>
                <input type="submit" value="Submit" />

                {checkedMembers && checkedMembers.length > 0 &&
                    checkedMembers.map((member) => (
                        <div className="member-item" key={member.user_id}>
                            <div className="member-info">
                                <div className="member-name">{member.fname} {member.lname}</div>
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




            </form>

        </div>
    );
};

export default NewProject;
