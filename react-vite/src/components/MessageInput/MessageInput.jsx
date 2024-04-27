import { useState } from 'react';
import { socket } from '../../socket';
import './MessageInput.css';
import { IoPaperPlaneSharp } from "react-icons/io5";
import { FaPlus } from 'react-icons/fa6'
import { useChannel } from '../../context/Channel';
import { useSelector } from 'react-redux';

function MessageInput({ sessionUser, edit = false }) {
    // Context
    const { channelId } = useChannel();

    // Redux Store
    const channels = useSelector(state => state.channels);

    // React
    const [newMessage, setNewMessage] = useState("");

    // Sends the new message to the server
    // and resets the message input state
    const handleNewMessage = (e) => {
        e.preventDefault();
        socket.emit('new_message', { authorId: sessionUser.id, channelId, content: newMessage});
        setNewMessage("");
    }

    // Listens for the 'enter' key for textarea submission
    const checkEnter = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            handleNewMessage(e);
        }
    }

    if(!channels.byId) return null;

    const channel = channels.byId[channelId];

    return (
        <form className={edit ? 'message-form edit-message': 'message-form new-message'} encType='multipart/form-data' onSubmit={handleNewMessage}>
            <div className='input-area'>
                <textarea
                    value={newMessage}
                    onKeyDown={checkEnter}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message # ${channel?.name}`}
                />
                <label>
                    <div className='add-file-btn' onClick={() => alert('File sharing coming soon!')}>
                        <FaPlus size={15}/>
                    </div>
                    {/* <input type="file" style={{display: 'none'}}/> */}
                </label>
                <button className={'send-btn'} onClick={handleNewMessage} disabled={!newMessage.length}>
                    <IoPaperPlaneSharp size={20}/>
                </button>
            </div>
            <input type="submit" style={{display: 'none'}}/>
        </form>
    );
}

export default MessageInput;
