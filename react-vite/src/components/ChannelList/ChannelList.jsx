import { FaCaretDown } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getAllChannelsThunk } from "../../redux/channels";
import OpenModalButton from '../OpenModalButton';
import ChannelForm from "../ChannelForm";
import './ChannelList.css';
import { useChannel } from "../../context/Channel";

function ChannelList() {
    const dispatch = useDispatch();
    const { channelId, setChannelId } = useChannel();
    const channels = useSelector(state => state.channels)
    const [showChannels, setShowChannels] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    useEffect(() => {
        dispatch(getAllChannelsThunk());
    }, [dispatch]);

    return (
        <div id="channel-list">
            <div className='list-controls no-select'>
                <FaCaretDown className={showChannels ? "caret" : "caret rotate"} onClick={() => setShowChannels(!showChannels)}/>
                <p>Channels</p>
                <button className="options-control" onClick={() => setDropdownOpen(!dropdownOpen)}>...</button>
                { dropdownOpen &&
                    <div id="channel-option-dd">
                        <OpenModalButton 
                            buttonText="Create"
                            modalComponent={<ChannelForm />}
                            onButtonClick={() => setDropdownOpen(false)}
                        />
                    </div>
                }
            </div>
            { showChannels && channels.allIds.map(id => (
            <div 
                key={id} 
                className={"no-select channel-list-item" + (channelId === id ? " selected" : "")} 
                onClick={() => setChannelId(id)}
            >
                {channels.byId[id].name}
            </div>
            ))}
        </div>
    );
}

export default ChannelList;