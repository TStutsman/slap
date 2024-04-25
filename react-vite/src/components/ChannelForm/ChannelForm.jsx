import { useState } from "react";
import { useModal } from "../../context/Modal";
import './ChannelForm.css'

function ChannelForm() {
    const [pageNum, setPageNum] = useState(1);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { closeModal } = useModal();

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Submitted!');
        closeModal();
    }

    const handleNext = e => {
        e.preventDefault();
        setPageNum(pageNum+1);
    }

    return (
        <form className="channel-form" onSubmit={handleSubmit}>
            <h2>Create a Channel</h2>
            { pageNum === 1 ?
                    <label>
                        Choose a channel name
                        <div className="hash">#</div>
                        <input 
                            type="text"
                            className="channel-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                    <button className="channel-form-btn" type="submit">Create Channel</button>
            }
        </form>
    );
}

export default ChannelForm;
