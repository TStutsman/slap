import Fetcher from "./fetcher";
const api = new Fetcher('/api');

const ADD_USERS = 'users/addUsers';
const UPDATE_PROFILE = 'users/updateProfile';

const addUsers = users => ({
    type: ADD_USERS,
    users
});

const updateProfile = (user) => ({
    type: UPDATE_PROFILE,
    user
})

export const getAllUsersThunk = () => async dispatch => {
    const data = await api.get('/users');

    if(data.server) {
        return data;
    }

    dispatch(addUsers(data));
}

// Update the user info not the session info
// to avoid socket disconnections
export const updateProfileThunk = (profile) => async dispatch => { 
    const data = await api.put('/users/current', profile);
  
    if(data.server) {
      return data;
    }
  
    dispatch(updateProfile(data));
    return data;
}

export const updateProfilePhotoThunk = profilePhoto => async dispatch => {
    const data = await api.post('/users/current/profilePhoto', profilePhoto);

    if(data.server) {
        return data;
    }

    dispatch(updateProfile(data));
    return data;
}

const initialState = { byId: null, allIds: [] }

export default function usersReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_USERS:
            return { ...state, byId: action.users.byId, allIds: action.users.allIds }
        case UPDATE_PROFILE:
            return { ...state, byId: {...state.byId, [action.user.id]: action.user} }
        default:
            return state;
    }
}