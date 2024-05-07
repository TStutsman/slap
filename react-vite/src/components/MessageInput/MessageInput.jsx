import { useState } from 'react';
import { messageSocket } from '../../socket';
import './MessageInput.css';
import { IoPaperPlaneSharp } from "react-icons/io5";
import { FaPlus } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';

function MessageInput({ sessionUser, edit = null, channelId }) {
    // Context
    const { closeModal } = useModal();

    // Redux Store
    const channels = useSelector(state => state.channels);

    // React
    const [newMessage, setNewMessage] = useState(edit?.content || "");

    // Sends the new message to the server
    // and resets the message input state
    const handleNewMessage = (e) => {
        e.preventDefault();

        const emitEvent = edit ? 'edit_message' : 'new_message';
        const message = { 
            authorId: sessionUser.id,
            channelId,
            content: newMessage
        };

        if(edit) message.id = edit.id;

        messageSocket.emit(emitEvent, message);
        if(!edit) setNewMessage("");
        else closeModal();
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
            { edit ? <h3 className='edit-header'>Edit message</h3> : null }
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
                <button className={'send-btn'} onClick={handleNewMessage} disabled={edit ? edit.content === newMessage : !newMessage.length}>
                    <IoPaperPlaneSharp size={20}/>
                </button>
            </div>
            <input type="submit" style={{display: 'none'}}/>
        </form>
    );
}

export default MessageInput;
