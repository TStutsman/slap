import { useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';
import MessageFeed from '../MessageFeed/MessageFeed';
import MessageInput from '../MessageInput';
import './ChannelPanel.css';

function ChannelPanel() {
    const { channelId } = useChannel();
    const sessionUser = useSelector(state => state.session.user);
    const channels = useSelector(state => state.channels);

    // Wait for dispatch to load
    if(!channels.byId) return null;

    // Convenience variable for accessing channel info
    const currentChannel = channels.byId[channelId];

    return (
        <div id="channel-panel">
            <div id='channel-details'>
                <h3>{currentChannel.name}</h3>
                <p>{currentChannel.numUsers} members</p>
            </div>
            <MessageFeed channelId={channelId}/>

            <MessageInput sessionUser={sessionUser} />
        </div>
    )
}

export default ChannelPanel;