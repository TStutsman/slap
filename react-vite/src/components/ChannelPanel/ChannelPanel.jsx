import { useDispatch, useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';
import './ChannelPanel.css'
import { useEffect } from 'react';
import { getChannelMessagesThunk } from '../../redux/messages';

function ChannelPanel() {
    const dispatch = useDispatch();
    const { channelId } = useChannel();
    const users = useSelector(state => state.users);
    const channels = useSelector(state => state.channels);
    const messages = useSelector(state => state.messages);

    useEffect(() => {
        dispatch(getChannelMessagesThunk(channelId));
    }, [dispatch, channelId]);

    // Wait for dispatch to load
    if(!channels.byId) return null;

    const currentChannel = channels.byId[channelId];

    return (
        <div id="channel-panel">
            <div id='channel-details'>
                <h3>{currentChannel.name}</h3>
                <p>{currentChannel.numUsers} members</p>
            </div>
            <div id='message-feed'>
                { messages.byId ? Object.entries(messages.byId).map(([id, message]) => (
                    <p key={id}>{users.byId?.[message.authorId].firstName}: {message.content}</p>
                ))
                :
                    <p>No messages yet...</p>
                }
            </div>
        </div>
    )
}

export default ChannelPanel;