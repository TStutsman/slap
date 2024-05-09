import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { useModal } from "../../context/Modal";
import { createNewChannelThunk, editChannelThunk } from '../../redux/channels';
import { channelSocket } from "../../socket";
import './ChannelForm.css'

function ChannelForm({ edit=null, setChannelId, workSpaceId }) {
    const dispatch = useDispatch();

    // Context
    const { closeModal } = useModal();

    // React
    const [pageNum, setPageNum] = useState(1);
    const [name, setName] = useState(edit?.name || "");
    const [description, setDescription] = useState(edit?.description || "");
    const [errors, setErrors] = useState({});

    // Here we dynamically choose the thunk we need
    // the second option sets the workspaceId for us, and accepts the channel
    // in order to perform identically to the edit thunk
    const thunk = edit ? editChannelThunk : (channel) => createNewChannelThunk(workSpaceId, channel);

    useEffect(() => {
        setErrors(previous => {
            delete previous.name;
            return { ...previous }
        });
    }, [name]);

    useEffect(() => {
        setErrors(previous => {
            delete previous.description;
            return { ...previous }
        });
    }, [description]);

    // only allow letters and dashes
    // sanitize uppercase -> lowercase and spaces -> dashes
    const formatSetName = (name) => {
        if(name.split().some(char => char.match(/[^\w\s-]/))) return;
        setName(name.toLowerCase().replace(' ', '-'));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        
        const newChannel = {
            ...edit,
            name,
            description,
            private: false
        }

        const response = await dispatch(thunk(newChannel));
        
        if (response.errors) {
            setErrors(response.errors);
            
            if (response.errors.name) setPageNum(1);
            return;
        }
        
        // emit channel event to broadcast to other users
        channelSocket.emit('channel_update', response.id);

        // Navigates the user to the newly created channel
        setChannelId(response.id);

        // Closes the create channel modal
        closeModal();
    }

    const handleNext = e => {
        e.preventDefault();
        setPageNum(pageNum+1);
    }

    return (
        <form className="channel-form" onSubmit={handleSubmit}>
            <h2>{edit ? `Update # ${edit.name}` : 'Create a Channel'}</h2>
            { pageNum === 1 ?
                    <label>
                        Choose a channel name
                        <div className="hash">#</div>
                        <input 
                            type="text"
                            className="channel-name"
                            value={name}
                            onChange={(e) => formatSetName(e.target.value)}
                            placeholder="your-channel-name-here"
                            required
                        />
                        { errors.name ? <p className="error">{errors.name}</p> : null }
                    </label>
                : 
                    <label>
                        Enter a description for your channel
                        <textarea
                            type="text"
                            className="channel-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="description here"
                            required
                        />
                        { errors.description ? <p className="error">{errors.description}</p> : null }
                    </label>
            }
            { pageNum < 2 ? 
                    <button className="channel-form-btn" onClick={handleNext}>Next</button> 
                : 
                    <button className="channel-form-btn" type="submit">{edit ? 'Update' : 'Create'} Channel</button>
            }
        </form>
    );
}

export default ChannelForm;
