import { useState, useEffect, useRef } from 'react';
import OpenModalButton from '../OpenModalButton';
import MessageInput from '../MessageInput';
import ConfirmDelete from '../ConfirmDelete';
import ProfileDetails from '../ProfileDetails';
import './Message.css';
import { useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';

function Message({ user, message }) {
    const defaultPhoto = "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/profile_default.png";

    // Redux
    const sessionUser = useSelector(state => state.session.user);

    // Context
    const { channelId } = useChannel();

    // React
    const [hovered, setHovered] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileHover, setProfileHover] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Element Reference
    const dropdownRef = useRef(null);

    // Toggle the logout menu
    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown on click anywhere off-menu
    useEffect(() => {
        if (!dropdownOpen) return;

        const closeMenu = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
        }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [dropdownOpen]);

    // Shows user profile when hovering user names
    useEffect(() => {
        let profileWait;

        if(profileHover) {
            // If the profile is hovered
            // Set a .75s wait to show profile
            // (has no effect if already showing)
            profileWait = setTimeout(() => {
                setShowProfile(true);
            }, 500);

        } else {
            // If the profile is unhovered
            // Set a .5s wait to hide profile
            // (has no effect if already hidden)
            profileWait = setTimeout(() => {
                setShowProfile(false);
            }, 300);
        }

        // Runs every time profileHover changes
        // (Before the above is reevaluated)
        return () => {
            // Clear the profileWait timer
            // before assigning a new one
            clearTimeout(profileWait);
        }
    }, [profileHover]);


    // Convenient variables
    const author = user || {
        id: -1,
        firstName: 'unknown',
        lastName: '',
        profilePhotoUrl: defaultPhoto
    }
    author.displayName = author.firstName + ' ' + author.lastName;

    // If the author has no profile photo use default
    if(!author.profilePhotoUrl) author.profilePhotoUrl = defaultPhoto;

    // Wait for message to populate before rendering
    if(!message) return null;

    return (
        <div className='message' onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className='profile-photo'>
                <img src={author.profilePhotoUrl} alt="profile_photo" />
            </div>
            <div className='content'>
                <div className='content-author-time' onMouseOver={() => setProfileHover(true)} onMouseLeave={() => setProfileHover(false)}>
                    <h6 className='author'>{author.displayName}</h6>
                    <p className='created-at'>{message.updatedAt}</p>
                    { showProfile && 
                        <div className='message-hover-profile'>
                            <ProfileDetails user={user}/>
                        </div> 
                    }
                </div>
                <p>{message.content}</p>
            </div>
            {
                sessionUser.id === user?.id &&
                <button className={hovered ? 'message-controls visible' : 'message-controls'} onClick={toggleMenu}>
                    ...
                </button>
            }
            { dropdownOpen &&
                    <div className="message-option-dd" ref={dropdownRef}>
                        <OpenModalButton 
                            buttonText="Edit Message"
                            modalComponent={<MessageInput sessionUser={sessionUser} edit={message} channelId={channelId}/>}
                            onButtonClick={() => setDropdownOpen(false)}
                        />
                        <OpenModalButton 
                            buttonText="Delete Message"
                            modalComponent={<ConfirmDelete type='message' resourceId={message.id}/>}
                            onButtonClick={() => setDropdownOpen(false)}
                        />
                    </div>
                }
        </div>
    );
}

export default Message;
