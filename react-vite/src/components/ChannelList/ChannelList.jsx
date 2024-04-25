import { NavLink } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getAllChannelsThunk } from "../../redux/channels";
import OpenModalButton from '../OpenModalButton';
import ChannelForm from "../ChannelForm";
import './ChannelList.css';

function ChannelList() {
    const dispatch = useDispatch();
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
                        />
                    </div>
                }
            </div>
            { showChannels && channels.allIds.map(id => (
            <NavLink key={id} to="/">{channels.byId[id].name}</NavLink>
            ))}
        </div>
    );
}

export default ChannelList;