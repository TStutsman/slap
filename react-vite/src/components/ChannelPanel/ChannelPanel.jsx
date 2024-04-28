import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';
import { socket } from '../../socket';
import MessageFeed from '../MessageFeed/MessageFeed';
import MessageInput from '../MessageInput';
import './ChannelPanel.css';

function ChannelPanel() {
    const { channelId } = useChannel();
    const sessionUser = useSelector(state => state.session.user);
    const channels = useSelector(state => state.channels);

    // Opens the socket after user is logged in
    useEffect(() => {
        if(sessionUser !== null) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        }
    }, [sessionUser]);

    // Wait for dispatch to load
    if(!channels.byId) return null;

    // Convenience variable for accessing channel info
    const currentChannel = channels.byId[channelId];

    return (
        <div id="channel-panel">
            {currentChannel ?
            <>
                <div id='channel-details'>
                    <h3>{currentChannel.name}</h3>
                    <p>{currentChannel.numUsers} members</p>
                </div>
                <MessageFeed channelId={channelId}/>

                <MessageInput sessionUser={sessionUser} />
            </>
            :
            <div id='channel-details'>
                <h3>No Channel Selected</h3>
            </div>
            }
        </div>
    )
}

export default ChannelPanel;