import Fetcher from './fetcher';
const api = new Fetcher('/api');

const ADD_WORKSPACES = 'workspaces/addWorkspaces';
const ADD_ONE_WORKSPACE = 'workspaces/addOneWorkspace';
const UPDATE_WORKSPACE = 'workspaces/updateWorkspace';

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
    const data = await api.put('/workspaces', workspace);

    if(!data.errors) dispatch(updateWorkspace(data));

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
        default:
            return state;
    }
}