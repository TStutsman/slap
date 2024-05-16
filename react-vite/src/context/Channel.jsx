import { useState, useContext, createContext, useEffect } from 'react';
import { messageSocket } from '../socket';

const ChannelContext = createContext();

export function ChannelProvider({ children }) {
    const [ channelId, setChannelId ] = useState(+localStorage.getItem('channelId') || 1);

    // Joins the channel when the id changes
    // Joining a channel allows the user to listen
    // for messages posted in that channel
    // Leaves the channel when joining a new one
    useEffect(() => {
        messageSocket.emit('join_channel', channelId);

        localStorage.setItem('channelId', channelId);

        return () => {
            messageSocket.emit('leave_channel', channelId);
        }
    }, [channelId]);

    return (
        <ChannelContext.Provider value={{ channelId, setChannelId }}>
            { children }
        </ChannelContext.Provider>
    );
}

export const useChannel = () => useContext(ChannelContext);