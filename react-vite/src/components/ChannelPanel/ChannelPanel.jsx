import { useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';
import './ChannelPanel.css'

function ChannelPanel() {
    const { channelId } = useChannel();
    const channels = useSelector(state => state.channels);
    const currentChannel = channels.byId[channelId];

    const messages = [1, 2, 3, 4, 5]
    return (
        <div id="channel-panel">
            <div id='channel-details'>
                <h3>{currentChannel.name}</h3>
                <p>369 members</p>
            </div>
            <div id='message-feed'>
                { messages.map(message => (
                    <p key={message}>Message {message}</p>
                ))}
            </div>
        </div>
    )
}

export default ChannelPanel;