import { useState } from 'react';
import { socket } from '../../socket';
import './MessageInput.css';
import { useSelector } from 'react-redux';
import { IoPaperPlaneSharp } from "react-icons/io5";

function MessageInput({ channelId, sessionUser }) {
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
        <form id='new-message-form'>
            <textarea
                value={newMessage}
                onKeyDown={checkEnter}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <input type="submit" style={{display: 'none'}}/>
            <IoPaperPlaneSharp size={24} onClick={handleNewMessage}/>
        </form>
    );
}

export default MessageInput;
