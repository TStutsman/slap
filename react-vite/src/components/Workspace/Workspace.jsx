import { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/Workspace';
import OpenModalButton from '../OpenModalButton';
import WorkspaceForm from '../WorkspaceForm';
import ConfirmDelete from '../ConfirmDelete';
import './Workspace.css';
import { useSelector } from 'react-redux';

function Workspace({ workspace }) {
    // Redux
    const sessionUser = useSelector(state => state.session.user)

    // Context
    const { workspaceId, setWorkspaceId } = useWorkspace();
    const selected = workspace.id === +workspaceId;

    // React
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef();

    const handleRightClick = e => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    }

    // Toggle the workspace menu
    // const toggleMenu = (e) => {
    //     e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    //     setDropdownOpen(!dropdownOpen);
    // };

    // Close dropdown on click anywhere off-menu
    useEffect(() => {
        if (!dropdownOpen) return;

        const closeMenu = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
        }
        };

        document.addEventListener("click", closeMenu);
        document.addEventListener("contextmenu", closeMenu);

        return () => {
            document.removeEventListener("click", closeMenu);
            document.removeEventListener("contextmenu", closeMenu);
        }
    }, [dropdownOpen]);

    return (
        <div className='workspace-wrapper'>
            <div 
                className={'workspace' + (selected ? ' selected' : '')}
                onClick={() => setWorkspaceId(workspace.id)}
                onContextMenu={handleRightClick}
            >
                <img src={workspace.iconUrl} alt="workspace_icon" />
            </div>
            { dropdownOpen &&
                <div className="workspace-option-dd" ref={dropdownRef}>
                    <OpenModalButton 
                        buttonText="Edit Workspace"
                        modalComponent={<WorkspaceForm edit={workspace} setWorkspaceId={setWorkspaceId}/>}
                        onButtonClick={() => setDropdownOpen(false)}
                    />
                    { workspace.creatorId === sessionUser.id &&
                        <OpenModalButton
                            buttonText="Delete Workspace"
                            modalComponent={<ConfirmDelete type='workspace' resourceId={workspace.id}/>}
                            onButtonClick={() => setDropdownOpen(false)}
                        />
                    }
                </div>
            }
        </div>
    );
}

export default Workspace;
