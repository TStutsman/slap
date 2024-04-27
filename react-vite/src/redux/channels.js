import Fetcher from "./fetcher";
const api = new Fetcher('/api');

const ADD_CHANNELS = 'channels/addChannels';
const ADD_ONE_CHANNEL = 'channels/addOneChannel';

const addChannels = channels => ({
    type: ADD_CHANNELS,
    channels
});

const addOneChannel = channel => ({
    type: ADD_ONE_CHANNEL,
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

    dispatch(addOneChannel(data));
}

const initial = { byId: null, allIds: [] }

export default function channelsReducer(state = initial, action) {
    switch(action.type) {
        case ADD_CHANNELS:
            return { ...state, byId: action.channels.byId, allIds: action.channels.allIds }
        case ADD_ONE_CHANNEL: {
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