import { useState } from 'react';
import OpenModalButton from '../OpenModalButton';
import MessageInput from '../MessageInput';
import ConfirmDelete from '../ConfirmDelete';
import './Message.css';
import { useSelector } from 'react-redux';

function Message({ user, message }) {
    // Redux
    const sessionUser = useSelector(state => state.session.user);

    // React
    const [hovered, setHovered] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const defaultPhoto = "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/profile_default.png";
    const author = user ? user : {
        id: -1,
        firstName: 'unknown',
        lastName: '',
        profilePhotoUrl: defaultPhoto
    }

    author.displayName = author.firstName ? author.firstName + ' ' + author.lastName : author.username;
    if(!author.profilePhotoUrl) author.profilePhotoUrl = defaultPhoto;

    if(!message) return null;

    return (
        <div className='message' onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className='profile-photo'>
                <img src={author.profilePhotoUrl} alt="profile_photo" />
            </div>
            <div className='content'>
                <h6>{author.displayName}</h6>
                <p>{message.content}</p>
            </div>
            {
                sessionUser.id === user?.id &&
                <button className={hovered ? 'message-controls visible' : 'message-controls'} onClick={() => setDropdownOpen(!dropdownOpen)}>
                    ...
                </button>
            }
            { dropdownOpen &&
                    <div id="message-option-dd">
                        <OpenModalButton 
                            buttonText="Edit Message"
                            modalComponent={<MessageInput sessionUser={sessionUser} edit={message}/>}
                            onButtonClick={() => setDropdownOpen(false)}
                        />
                        <OpenModalButton 
                            buttonText="Delete Message"
                            modalComponent={<ConfirmDelete messageId={message.id}/>}
                            onButtonClick={() => setDropdownOpen(false)}
                        />
                    </div>
                }
        </div>
    );
}

export default Message;
