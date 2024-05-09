import { useState, useContext, createContext, useEffect } from 'react';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
    const [ workspaceId, setWorkspaceId ] = useState(localStorage.getItem('workspaceId') || 1);

    useEffect(() => {
        localStorage.setItem('workspaceId', workspaceId);
    }, [workspaceId]);

    return (
        <WorkspaceContext.Provider value={{ workspaceId, setWorkspaceId }}>
            { children }
        </WorkspaceContext.Provider>
    );
}

export const useWorkspace = () => useContext(WorkspaceContext);