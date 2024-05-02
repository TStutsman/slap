import { useState, useContext, createContext, useEffect } from 'react';

const ChannelContext = createContext();

export function ChannelProvider({ children }) {
    const [ channelId, setChannelId ] = useState(localStorage.getItem('channelId') || 1);

    useEffect(() => {
        localStorage.setItem('channelId', channelId);
    }, [channelId])

    return (
        <ChannelContext.Provider value={{ channelId, setChannelId }}>
            { children }
        </ChannelContext.Provider>
    );
}

export const useChannel = () => useContext(ChannelContext);