import { FaCaretDown } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getAllChannelsThunk } from "../../redux/channels";
import OpenModalButton from '../OpenModalButton';
import ChannelForm from "../ChannelForm";
import './ChannelList.css';
import ChannelListItem from "../ChannelListItem/ChannelListItem";

function ChannelList() {
    // Redux
    const dispatch = useDispatch();
    const channels = useSelector(state => state.channels)

    // React
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
                <ChannelListItem key={id} channel={channels.byId[id]} />
            ))}
        </div>
    );
}

export default ChannelList;