import Fetcher from './fetcher';
const api = new Fetcher('/api');

const ADD_WORKSPACES = 'workspaces/addWorkspaces';

const addWorkspaces = workspaces => ({
    type: ADD_WORKSPACES,
    workspaces
});

export const getUserWorkspacesThunk = () => async dispatch => {
    const data = await api.get('/workspaces/current');

    if(data.server) return data;

    dispatch(addWorkspaces(data));
    return data;
}

const initialState = { byId: null, allIds: [] }

export default function workspacesReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_WORKSPACES: 
            return { ...state, byId: action.workspaces.byId, allIds: action.workspaces.allIds };
        default:
            return state;
    }
}