import { useSelector } from "react-redux";
import { useChannel } from "../../context/Channel";
import { useState, useEffect, useRef } from "react";
import OpenModalButton from '../OpenModalButton';
import ChannelForm from "../ChannelForm";
import ConfirmDelete from '../ConfirmDelete';
import './ChannelListItem.css';

function ChannelListItem({ channel }) {
    // Context
    const { channelId, setChannelId } = useChannel();

    // Redux
    const sessionUser = useSelector(state => state.session.user);

    // React
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Reference for dropdown element
    const ddRef = useRef(null);

    // Toggle without bubbling event
    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    }

    // Clicking anywhere on the page closes the dropdown
    useEffect(() => {
        if (!dropdownOpen) return;

        const closeMenu = (e) => {
            if (ddRef.current && !ddRef.current.contains(e.target)) {
            setDropdownOpen(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [dropdownOpen]);

    return (
        <div 
            className={"no-select channel-list-item" + (channelId === channel.id ? " selected" : "")} 
            onClick={() => setChannelId(channel.id)}
        >
            {channel.name}
            {channel.creatorId === sessionUser.id && channelId === channel.id &&
                <button className="options-control" onClick={toggleDropdown}>...</button>
            }
            { dropdownOpen &&
                <div className="channel-options-dd" ref={ddRef}>
                    <OpenModalButton 
                        buttonText="Edit Channel"
                        modalComponent={<ChannelForm edit={channel}/>}
                        onButtonClick={() => setDropdownOpen(false)}
                    />
                    <OpenModalButton 
                        buttonText="Delete Channel"
                        modalComponent={<ConfirmDelete type="channel" resourceId={channel.id} />}
                        onButtonClick={() => setDropdownOpen(false)}
                    />
                </div>
            }
        </div>
    );
}

export default ChannelListItem;