import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { useModal } from "../../context/Modal";
import { createWorkspaceThunk, editWorkspaceThunk } from '../../redux/workspaces';
import { formDataFromObject } from '../../utils/formDataUtils';
import { FaPlus, FaXmark } from 'react-icons/fa6';
import './WorkspaceForm.css';

function WorkspaceForm({ edit = null, setWorkspaceId }) {
    const dispatch = useDispatch();

    // Context
    const { closeModal } = useModal();

    // React
    const [pageNum, setPageNum] = useState(1);
    const [name, setName] = useState(edit?.name || "");
    const [icon, setIcon] = useState();
    const [tempUrl, setTempUrl] = useState(edit?.iconUrl || "");
    const [errors, setErrors] = useState({});

    const thunk = edit ? editWorkspaceThunk : createWorkspaceThunk;

    useEffect(() => {
        setErrors(previous => {
            delete previous.name;
            return { ...previous }
        });
    }, [name]);

    useEffect(() => {
        setErrors(previous => {
            delete previous.icon;
            return { ...previous }
        });
    }, [icon]);

    // only allow letters and dashes
    const formatSetName = (name) => {
        if(name.split().some(char => char.match(/[^\w\s-]/))) return;
        setName(name);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        
        const newWorkspace = {
            ...edit,
            name,
            icon
        }

        const formData = formDataFromObject(newWorkspace);

        const response = await dispatch(thunk(formData));
        
        if (response.errors) {
            setErrors(response.errors);
            
            if (response.errors.name) setPageNum(1);
            return;
        }

        // Navigates the user to the newly created workspace
        setWorkspaceId(response.id);

        // Closes the create workspace modal
        closeModal();
    }

    const handleIconChoice = (e) => {
        // If they did not choose a file
        if(!e.target.files.length) {

            // Release old file URL
            if(tempUrl.length) {
                cancelIcon();
            }
            return;
        }

        const file = e.target.files[0];
        setIcon(file);
        
        if(tempUrl.length) URL.revokeObjectURL(tempUrl);

        setTempUrl(URL.createObjectURL(file));
    }

    const cancelIcon = () => {
        URL.revokeObjectURL(tempUrl);
        setTempUrl("");
        setIcon(null);
    }

    const handleNext = e => {
        e.preventDefault();
        setPageNum(pageNum+1);
    }

    return (
        <form className="workspace-form" encType="multipart/form-data" onSubmit={handleSubmit}>
            <h2>{edit ? `Update ${edit.name}` : 'Create a Workspace'}</h2>
            { pageNum === 1 ?
                    <label>
                        Choose a workspace name
                        <input 
                            type="text"
                            className="workspace-name"
                            value={name}
                            onChange={(e) => formatSetName(e.target.value)}
                            placeholder="i.e. App Academy"
                            required
                        />
                        { errors.name ? <p className="error">{errors.name}</p> : null }
                    </label>
                : 
                    <label>
                        Choose an icon for your workspace
                        file
                        { tempUrl.length ? 
                            <div className="input-image-container">
                                <FaXmark onClick={cancelIcon} />
                                <img src={tempUrl} alt="Chosen Icon" />
                            </div>
                            :
                            <div className="add-icon-btn">
                                <FaPlus />
                            </div>
                        }
                        <input
                            type="file"
                            accept="image/*"
                            className="workspace-icon"
                            onChange={handleIconChoice}
                            required
                        />
                        { errors.icon ? <p className="error">{errors.icon}</p> : null }
                    </label>
            }
            { pageNum < 2 ? 
                    <button className="workspace-form-btn" onClick={handleNext}>Next</button> 
                : 
                    <button className="workspace-form-btn" type="submit">{edit ? 'Update' : 'Create'} Workspace</button>
            }
        </form>
    );
}

export default WorkspaceForm;
