import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../socket";

import Message from "../Message";

function MessageFeed({ channelId }) {
    // Redux Store
    const sessionUser = useSelector(state => state.session.user);
    const users = useSelector(state => state.users);

    // React
    const [messages, setMessages] = useState({});
    const [messageOrder, setMessageOrder] = useState([]);
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
            setMessages(messages.byId);
            setMessageOrder(messages.order);
        }
    
        // Runs when another user posts a new message
        // and the server broadcasts it to all listeners
        function onMessageBroadcast(message) {
            setMessages(previous => [...previous, message]);
        }

        function updateMessage(message) {
            setMessages(previous => ({ ...previous, [message.id]: message}))
        }

        function deleteMessage(messageId) {
            setMessageOrder(previous => {
                const i = previous.indexOf(messageId);
                const next = [ ...previous.slice(0, i), ...previous.slice(i + 1)];
                return next;
            });

            setMessages(previous => {
                const next = { ...previous };
                delete next[messageId];
                return next;
            });
        }

        // Initialize socket events to listen to
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('load_messages', loadMessages);
        socket.on('message_broadcast', onMessageBroadcast);
        socket.on('update_broadcast', updateMessage);
        socket.on('delete_broadcast', deleteMessage);

        // On component unmount, remove socket event listeners
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('load_messages', loadMessages);
            socket.off('message_broadcast', onMessageBroadcast);
            socket.off('update_broadcast', updateMessage);
            socket.off('delete_broadcast', deleteMessage);
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
            { messages ? messageOrder.map((messageId) => {
                const message = messages[messageId];
                return <Message key={message.id} user={users.byId?.[message.authorId]} message={message}/>
            })
            :
                <p>No messages yet...</p>
            }
        </div>
    );
}

export default MessageFeed;
