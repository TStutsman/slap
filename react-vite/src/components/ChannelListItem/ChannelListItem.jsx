import { useSelector } from "react-redux";
import { useChannel } from "../../context/Channel";
import { useState, useEffect, useRef } from "react";
import OpenModalButton from '../OpenModalButton';
import ChannelForm from "../ChannelForm";
import ConfirmDelete from '../ConfirmDelete';
import './ChannelListItem.css';
import { useWorkspace } from "../../context/Workspace";

function ChannelListItem({ channel, joined }) {
    // Context
    const { channelId, setChannelId } = useChannel();
    const { workSpaceId } = useWorkspace();

    // Redux
    const sessionUser = useSelector(state => state.session.user);

    // React
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selected, setSelected] = useState(false);

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

    useEffect(() => {
        setSelected(+channelId === channel.id);
    }, [channelId, channel]);

    return (
        <div 
            className={"no-select channel-list-item" + (selected ? " selected" : "") + (joined ? " joined" : "")} 
            onClick={() => setChannelId(channel.id)}
        >
            {channel.name}
            {channel.creatorId === sessionUser.id && selected &&
                <button className="options-control channel-options" onClick={toggleDropdown}>...</button>
            }
            { dropdownOpen &&
                <div className="channel-options-dd" ref={ddRef}>
                    <OpenModalButton 
                        buttonText="Edit Channel"
                        modalComponent={<ChannelForm edit={channel} setChannelId={setChannelId} workSpaceId={workSpaceId}/>}
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
