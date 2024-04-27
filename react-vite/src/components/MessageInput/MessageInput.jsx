import { useState } from 'react';
import { socket } from '../../socket';
import './MessageInput.css';
import { IoPaperPlaneSharp } from "react-icons/io5";
import { FaPlus } from 'react-icons/fa6'

function MessageInput({ channelId, channelName, sessionUser }) {
    const [newMessage, setNewMessage] = useState("");

    const handleNewMessage = (e) => {
        e.preventDefault();
        socket.emit('new_message', { authorId: sessionUser.id, channelId, content: newMessage});
        setNewMessage("");
    }

    const checkEnter = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            handleNewMessage(e);
        }
    }

    return (
        <form id='new-message-form' encType='multipart/form-data' onSubmit={handleNewMessage}>
            <div className='input-area'>
                <textarea
                    value={newMessage}
                    onKeyDown={checkEnter}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message # ${channelName}`}
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
