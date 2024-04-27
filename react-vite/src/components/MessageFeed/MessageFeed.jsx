import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../socket";

import Message from "../Message";

function MessageFeed({ channelId }) {
    // Redux Store
    const sessionUser = useSelector(state => state.session.user);
    const users = useSelector(state => state.users);

    // React
    const [messages, setMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(socket.connected)
    const messageFeed = useRef(null);


    // ============ SIDE EFFECTS ===============

    // Opens the socket after user is logged in
    useEffect(() => {
        if(sessionUser !== null) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        }
    }, [sessionUser]);

    // Requests the channel messages from the server
    // Whenever the channel changes
    useEffect(() => {
        socket.emit('load_messages', channelId);
    }, [channelId]);

    // Definitions for events to listen to from the server
    useEffect(() => {
        // Runs after the server sends a
        // successful connect response
        function onConnect() {
            setSocketConnected(true);
            console.log('Socket Connected!')
        }

        // Runs after the server sends a
        // successful disconnect response
        function onDisconnect() {
            setSocketConnected(false);
            console.log('Socket Disconnected!')
        }
    
        // Runs when the server sends all the messages
        // for a specified channel
        function loadMessages(messages) {
            setMessages(messages);
        }
    
        // Runs when another user posts a new message
        // and the server broadcasts it to all listeners
        function onMessageBroadcast(message) {
            console.log("Recieved", message)
            setMessages(previous => [...previous, message]);
        }

        // Initialize socket events to listen to
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('load_messages', loadMessages);
        socket.on('message_broadcast', onMessageBroadcast);

        // On component unmount, remove socket event listeners
        return () => {
            socket.off('connect', onConnect);
            socket.off('load_messages', loadMessages);
            socket.off('message_broadcast', onMessageBroadcast)
        }
    }, []);

    // Scroll to the bottom of the feed when either:
    // The feed is first rendered or
    // A new message is posted to the feed
    useEffect(() => {
        if(!messageFeed.current) return;
        messageFeed.current.scrollTop = messageFeed.current.scrollHeight;
    }, [messages]);

    // =====================================================

    // Wait for successful socket connection
    if(!socketConnected) return null;

    return (
        <div id='message-feed' ref={messageFeed}>
            { messages ? messages.map((message) => (
                <Message key={message.id} user={users.byId?.[message.authorId]} message={message}/>
            ))
            :
                <p>No messages yet...</p>
            }
        </div>
    );
}

export default MessageFeed;
