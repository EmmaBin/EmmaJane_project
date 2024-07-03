import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PopUp from './PopUp';


const NewProject = () => {
    const { fname } = useParams();
    const [projectInfo, setProjectInfo] = React.useState({
        pname: "",
        address:""
    });
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectInfo({ ...projectInfo, [name]: value });
    };

    function handleSubmit(e){
        e.preventDefault();
        console.log(projectInfo.pname, projectInfo.address)
    }

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
            </form>
  
        </div>
    );
};

export default NewProject;
