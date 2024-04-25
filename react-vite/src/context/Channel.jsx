import { useState, useContext, createContext } from 'react';

const ChannelContext = createContext();

export function ChannelProvider({ children }) {
    const [ channelId, setChannelId ] = useState(1);

    return (
        <ChannelContext.Provider value={{ channelId, setChannelId }}>
            { children }
        </ChannelContext.Provider>
    );
}

export const useChannel = () => useContext(ChannelContext);