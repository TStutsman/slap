import Fetcher from "./fetcher";
const api = new Fetcher('/api');

const ADD_CHANNELS = 'channels/addChannels';
const NEW_CHANNEL = 'channels/newChannel';

const addChannels = channels => ({
    type: ADD_CHANNELS,
    channels
});

const newChannel = channel => ({
    type: NEW_CHANNEL,
    channel
});

export const getAllChannelsThunk = () => async dispatch => {
    const data = await api.get('/channels');

    // Error condition
    if(data.server) {
        return data;
    }

    dispatch(addChannels(data));
}

export const createNewChannelThunk = (channel) => async dispatch => {
    const data = await api.post('/channels', channel);

    if(data.server) {
        return data;
    }

    dispatch(newChannel(data));
}

const initial = { byId: null, allIds: [] }

export default function channelsReducer(state = initial, action) {
    switch(action.type) {
        case ADD_CHANNELS:
            return { ...state, byId: action.channels.byId, allIds: action.channels.allIds }
        case NEW_CHANNEL: {
            const byId = { ...state.byId }
            byId[action.channel.id] = action.channel;
            const allIds = [ ...state.allIds ]
            allIds.push(action.channel.id)
            return { byId, allIds }
        }
        default:
            return state;
    }
}