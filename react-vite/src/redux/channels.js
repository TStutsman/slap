const ADD_CHANNELS = 'channels/addChannels';

const addChannels = channels => ({
    type: ADD_CHANNELS,
    channels
})

export const getAllChannelsThunk = () => async dispatch => {
    const response = await fetch('/api/channels');

    if(response.ok) {
        const data = await response.json();
        dispatch(addChannels(data));
        return data;
    } else {
        return { server: "Something went wrong. Please try again"}
    }
}

const initial = { byId: null, allIds: [] }

export default function channelsReducer(state = initial, action) {
    switch(action.type) {
        case ADD_CHANNELS:
            return { ...state, byId: action.channels.byId, allIds: action.channels.allIds }
        default:
            return state;
    }
}