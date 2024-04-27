import Fetcher from "./fetcher";
const api = new Fetcher('/api');

const ADD_USERS = 'users/addUsers';

const addUsers = users => ({
    type: ADD_USERS,
    users
});

export const getAllUsersThunk = () => async dispatch => {
    const data = await api.get('/users');

    if(data.server) {
        return data;
    }

    dispatch(addUsers(data));
}

const initialState = { byId: null, allIds: [] }

export default function usersReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_USERS:
            return { ...state, byId: action.users.byId, allIds: action.users.allIds }
        default:
            return state;
    }
}