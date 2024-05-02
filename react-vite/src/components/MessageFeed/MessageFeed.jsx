import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteChannel } from "../../redux/channels";
import { socket } from "../../socket";
import ChannelWasDeleted from '../ChannelWasDeleted';
import Message from "../Message";

function MessageFeed({ channelId }) {
    const dispatch = useDispatch();

    // Context
    const { setModalContent } = useModal();

    // Redux Store
    const users = useSelector(state => state.users);

    // React
    const [messages, setMessages] = useState({});
    const [messageOrder, setMessageOrder] = useState([]);
    const [socketConnected, setSocketConnected] = useState(socket.connected)
    const messageFeed = useRef(null);


    // ============ SIDE EFFECTS ===============

    // Joins the channel when the id changes
    // Joining a channel allows the user to listen
    // for messages posted in that channel
    // Leaves the channel when joining a new one
    useEffect(() => {
        socket.emit('join_channel', channelId);

        return () => {
            socket.emit('leave_channel', channelId);
        }
    }, [channelId]);

    // Definitions for events to listen to from the server
    useEffect(() => {
        // Runs after the server sends a
        // successful connect response
        function onConnect() {
            setSocketConnected(true);
        }

        // Runs after the server sends a
        // successful disconnect response
        function onDisconnect() {
            setSocketConnected(false);
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
            setMessages(previous => ({ ...previous, [message.id]: message }));
            setMessageOrder(previous => [...previous, message.id]);
        }

        // Runs when any user updates a message
        function updateMessage(message) {
            setMessages(previous => ({ ...previous, [message.id]: message }))
        }

        // Runs when any user deletes a message
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

        // Removes the channel if the owner deletes it
        function removeChannel(channel) {
            dispatch(deleteChannel(channel));

            setModalContent(<ChannelWasDeleted />);
        }

        // Initialize socket events to listen to
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('load_messages', loadMessages);
        socket.on('message_broadcast', onMessageBroadcast);
        socket.on('update_broadcast', updateMessage);
        socket.on('delete_broadcast', deleteMessage);
        socket.on('channel_deleted', removeChannel);

        // On component unmount, remove socket event listeners
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('load_messages', loadMessages);
            socket.off('message_broadcast', onMessageBroadcast);
            socket.off('update_broadcast', updateMessage);
            socket.off('delete_broadcast', deleteMessage);
            socket.off('channel_deleted', removeChannel);
        }
    }, [dispatch, setModalContent]);

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
