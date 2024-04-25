import { NavLink } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getAllChannelsThunk } from "../../redux/channels";

function ChannelList() {
    const dispatch = useDispatch();
    const channels = useSelector(state => state.channels)
    const [showChannels, setShowChannels] = useState(true);

    useEffect(() => {
        dispatch(getAllChannelsThunk());
    }, [dispatch])

    return (
        <div id="channel-list">
            <div className='list-controls no-select'>
                <FaCaretDown className={showChannels ? "caret" : "caret rotate"} onClick={() => setShowChannels(!showChannels)}/>
                <p>Channels</p>
                <button className="options-control">...</button>
            </div>
            { showChannels && channels.allIds.map(id => (
            <NavLink key={id} to="/">{channels.byId[id].name}</NavLink>
            ))}
        </div>
    );
}

export default ChannelList;