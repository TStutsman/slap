import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWorkspacesThunk } from '../../redux/workspaces';
import { FaPlus } from 'react-icons/fa6';
import Workspace from '../Workspace';
import WorkspaceForm from '../WorkspaceForm';
import './WorkspaceList.css';
import { useWorkspace } from '../../context/Workspace';
import { useModal } from '../../context/Modal';

function WorkspaceList() {
    const dispatch = useDispatch();

    // Context
    const { setModalContent } = useModal();
    const { setWorkspaceId } = useWorkspace();

    // Redux
    const workspaces = useSelector(state => state.workspaces);

    useEffect(() => {
        dispatch(getUserWorkspacesThunk());
    }, [dispatch]);

    if(!workspaces.byId) return <div id='workspace-list'></div>

    return (
        <div id='workspace-list'>
            { Object.entries(workspaces.byId).map(([id, workspace]) => (
                <Workspace key={id} workspace={workspace}/>
            ))}

            <div className='new-workspace' onClick={() => setModalContent(<WorkspaceForm setWorkspaceId={setWorkspaceId}/>)}>
                <FaPlus size={20}/>
            </div>
        </div>
    );
}

export default WorkspaceList;
