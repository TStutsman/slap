import { useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';
import './ChannelPanel.css'
import { useState, useEffect, useRef } from 'react';
import Message from '../Message/Message';
import MessageInput from '../MessageInput';
import { socket } from '../../socket';

function ChannelPanel() {
    const { channelId } = useChannel();
    const sessionUser = useSelector(state => state.session.user);
    const users = useSelector(state => state.users);
    const channels = useSelector(state => state.channels);

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [messages, setMessages] = useState([]);
    
    const messageFeed = useRef(null);

    useEffect(() => {
        if(sessionUser !== null) {
            socket.connect();
            socket.emit('load_messages', channelId);
        }

        return () => {
            socket.disconnect();
        }
    }, [sessionUser, channelId]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log('Socket Connected!')
        }
    
        function loadMessages(messages) {
            setMessages(messages);
        }
    
        function onMessageBroadcast(message) {
            console.log("Recieved", message)
            setMessages(previous => [...previous, message]);
        }

        socket.on('connect', onConnect);
        socket.on('load_messages', loadMessages);
        socket.on('message_broadcast', onMessageBroadcast);

        return () => {
            socket.off('connect', onConnect);
            socket.off('load_messages', loadMessages);
            socket.off('message_broadcast', onMessageBroadcast)
        }
    }, [channelId]);

    useEffect(() => {
        if(!messageFeed.current) return;
        messageFeed.current.scrollTop = messageFeed.current.scrollHeight;
    }, [messages]);


    // Wait for dispatch to load
    if(!channels.byId) return null;
    if(!isConnected) return null;

    const currentChannel = channels.byId[channelId];

    return (
        <div id="channel-panel">
            <div id='channel-details'>
                <h3>{currentChannel.name}</h3>
                <p>{currentChannel.numUsers} members</p>
            </div>
            <div id='message-feed' ref={messageFeed}>
                { messages ? messages.map((message) => (
                    <Message key={message.id} user={users.byId?.[message.authorId]} message={message}/>
                ))
                :
                    <p>No messages yet...</p>
                }
            </div>

            <MessageInput channelId={channelId} channelName={currentChannel.name} sessionUser={sessionUser} />
        </div>
    )
}

export default ChannelPanel;