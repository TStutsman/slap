import { useState } from "react";
import { useDispatch } from 'react-redux'
import { useModal } from "../../context/Modal";
import { useChannel } from '../../context/Channel';
import { createNewChannelThunk, editChannelThunk } from '../../redux/channels';
import './ChannelForm.css'

function ChannelForm({ edit=null }) {
    const dispatch = useDispatch();

    // Context
    const { closeModal } = useModal();
    const { setChannelId } = useChannel();

    // React
    const [pageNum, setPageNum] = useState(1);
    const [name, setName] = useState(edit?.name || "");
    const [description, setDescription] = useState(edit?.description || "");

    const thunk = edit ? editChannelThunk : createNewChannelThunk;

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

        const createdChannel = await dispatch(thunk(newChannel));
        
        // Navigates the user to the newly created channel
        setChannelId(createdChannel.id);

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
