import { useWorkspace } from '../../context/Workspace';
import './Workspace.css';

function Workspace({ workspace }) {
    // Context
    const { workspaceId } = useWorkspace();

    const selected = workspace.id === +workspaceId;

    return (
        <div className='workspace-wrapper'>
            <div className={'workspace' + (selected ? ' selected' : '')}>
                <img src={workspace.iconUrl} alt="workspace_icon" />
            </div>
        </div>
    );
}

export default Workspace;
