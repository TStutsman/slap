import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWorkspacesThunk } from '../../redux/workspaces';
import { FaPlus } from 'react-icons/fa6';
import Workspace from '../Workspace';
import './WorkspaceList.css';

function WorkspaceList() {
    const dispatch = useDispatch();

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

            <div className='new-workspace'>
                <FaPlus size={20}/>
            </div>
        </div>
    );
}

export default WorkspaceList;
