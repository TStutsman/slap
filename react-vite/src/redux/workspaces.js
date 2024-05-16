import Fetcher from './fetcher';
const api = new Fetcher('/api');

const ADD_WORKSPACES = 'workspaces/addWorkspaces';
const ADD_ONE_WORKSPACE = 'workspaces/addOneWorkspace';
const UPDATE_WORKSPACE = 'workspaces/updateWorkspace';
const REMOVE_WORKSPACE = 'workspaces/removeWorkspace';

const addWorkspaces = workspaces => ({
    type: ADD_WORKSPACES,
    workspaces
});

const addOneWorkspace = workspace => ({
    type: ADD_ONE_WORKSPACE,
    workspace
});

const updateWorkspace = workspace => ({
    type: UPDATE_WORKSPACE,
    workspace
});

const removeWorkspace = workspace => ({
    type: REMOVE_WORKSPACE,
    workspaceId: workspace.id
})

export const getUserWorkspacesThunk = () => async dispatch => {
    const data = await api.get('/workspaces/current');

    if(!data.errors) dispatch(addWorkspaces(data));
    
    return data;
}

export const createWorkspaceThunk = workspace => async dispatch => {
    const data = await api.post('/workspaces', workspace);

    if(!data.errors) dispatch(addOneWorkspace(data));

    return data;
}

export const editWorkspaceThunk = workspace => async dispatch => {
    const data = await api.put(`/workspaces/${workspace.get('id')}`, workspace);

    if(!data.errors) dispatch(updateWorkspace(data));

    return data;
}

export const deleteWorkspaceThunk = workspaceId => async dispatch => {
    const data = await api.delete(`/workspaces/${workspaceId}`);

    if(!data.errors) dispatch(removeWorkspace(data));

    return data;
}

export const joinWorkspaceThunk = workspaceId => async dispatch => {
    const data = await api.get(`/workspaces/${workspaceId}/join`);

    if(!data.errors) dispatch(addOneWorkspace(data));

    return data;
}

export const leaveWorkspaceThunk = workspaceId => async dispatch => {
    const data = await api.get(`/workspaces/${workspaceId}/leave`);

    if(!data.errors) dispatch(removeWorkspace(data));

    return data;
}

const initialState = { byId: null, allIds: [] }

export default function workspacesReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_WORKSPACES: 
            return { ...state, byId: action.workspaces.byId, allIds: action.workspaces.allIds };

        case ADD_ONE_WORKSPACE: {
            state.byId[action.workspace.id] = action.workspace;
            state.allIds.push(action.workspace.id);

            // update the location of state in memory
            return { ...state };
        }

        case UPDATE_WORKSPACE: 
            return { 
                ...state, 
                byId: {...state.byId, [action.workspace.id]: action.workspace }
            };

        case REMOVE_WORKSPACE: {
            const allIds = state.allIds.filter(id => +id !== +action.workspaceId);
            delete state.byId[action.workspaceId];
            return { ...state, allIds };
        }

        default:
            return state;
    }
}