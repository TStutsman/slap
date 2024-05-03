import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { initializeMessageResock } from "../../redux/messages";
import { initializeChannelResock } from '../../redux/channels';
import { socket } from "../../socket";
import Message from "../Message";

function MessageFeed() {
    const dispatch = useDispatch();

    // Context
    const { setModalContent } = useModal();

    // Redux Store
    const users = useSelector(state => state.users);
    const messages = useSelector(state => state.messages);

    // React
    const messageFeed = useRef(null);


    // ============ SIDE EFFECTS ===============

    // Definitions for events to listen to from the server
    useEffect(() => {
        // Adds all the event listeners to redux
        const messagesResock =  dispatch(initializeMessageResock());
        const channelsResock = dispatch(initializeChannelResock());

        // On component unmount, remove socket event listeners
        return () => {
            messagesResock.removeListeners();
            channelsResock.removeListeners();
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
    if(!socket.connected) return null;

    return (
        <div id='message-feed' ref={messageFeed}>
            { messages ? messages.order.map((messageId) => {
                const message = messages.byId[messageId];
                return <Message key={message.id} user={users.byId?.[message.authorId]} message={message}/>
            })
            :
                <p>No messages yet...</p>
            }
        </div>
    );
}

export default MessageFeed;
