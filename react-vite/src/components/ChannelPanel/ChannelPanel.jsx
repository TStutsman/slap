import { useDispatch, useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';
import './ChannelPanel.css'
import { useState, useEffect } from 'react';
// import { addMessages, getChannelMessagesThunk } from '../../redux/messages';
import Message from '../Message/Message';
import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
const socket = io(URL, { autoConnect: false });

function ChannelPanel() {
    const dispatch = useDispatch();
    const { channelId } = useChannel();
    const users = useSelector(state => state.users);
    const channels = useSelector(state => state.channels);
    // const messages = useSelector(state => state.messages);

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        // dispatch(getChannelMessagesThunk(channelId));
        function onConnect() {
            setIsConnected(true);
            console.log('Connected!')
        }

        function onMessageBroadcast(message) {
            console.log("Recieved", message)
            setMessages([...messages, message]);
        }

        socket.on('connect', onConnect);
        socket.on('message_broadcast', onMessageBroadcast);

        return () => {
            socket.off('connect', onConnect);
            socket.off('message_broadcast', onMessageBroadcast)
        }
    }, [dispatch, channelId, messages]);

    const handleNewMessage = (e) => {
        e.preventDefault();
        socket.emit('new_message', {channelId, content: newMessage});
    }

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
            <div id='message-feed'>
                { messages ? messages.map((message) => (
                    <Message key={message.id} user={users.byId?.[message.authorId]} message={message}/>
                ))
                :
                    <p>No messages yet...</p>
                }
            </div>

            <form onSubmit={handleNewMessage}>
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default ChannelPanel;