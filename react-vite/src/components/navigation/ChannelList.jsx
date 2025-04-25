import { useChannel } from "@context/Channel";
import { useWorkspace } from "@context/Workspace";
import { getWorkspaceChannelsThunk, initializeChannelResock } from "@redux/channels";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import ChannelForm from "../forms/ChannelForm";
import ChannelListItem from "./ChannelListItem";
import OpenModalButton from '../OpenModalButton';
import './ChannelList.css';

function ChannelList() {
    // Redux
    const dispatch = useDispatch();
    const channels = useSelector(state => state.channels)

    // Context
    const { setChannelId } = useChannel();
    const { workspaceId } = useWorkspace();

    // React
    const [showChannels, setShowChannels] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    useEffect(() => {
        dispatch(getWorkspaceChannelsThunk(workspaceId));

        // Adds all the event listeners to redux
        const channelsResock = dispatch(initializeChannelResock());

        // On component unmount, remove socket event listeners
        return () => {
            channelsResock.removeListeners();
        }
    }, [dispatch, workspaceId]);

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
                            modalComponent={<ChannelForm setChannelId={setChannelId} workSpaceId={workspaceId}/>}
                            onButtonClick={() => setDropdownOpen(false)}
                        />
                    </div>
                }
            </div>
            { showChannels && channels.allIds.map(id => (
                <ChannelListItem key={id} channel={channels.byId[id]} joined={channels.joined.has(id)}/>
            ))}
        </div>
    );
}

export default ChannelList;