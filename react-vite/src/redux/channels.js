import Fetcher from "./fetcher";
const api = new Fetcher('/api');

const ADD_CHANNELS = 'channels/addChannels';
const ADD_ONE_CHANNEL = 'channels/addOneChannel';
const UPDATE_CHANNEL = 'channels/updateChannel';
const DELETE_CHANNEL = 'channels/deleteChannel';

const addChannels = channels => ({
    type: ADD_CHANNELS,
    channels
});

const addOneChannel = channel => ({
    type: ADD_ONE_CHANNEL,
    channel
});

const updateChannel = channel => ({
    type: UPDATE_CHANNEL,
    channel
});

const deleteChannel = channel => ({
    type: DELETE_CHANNEL,
    channelId: channel.id
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

export const editChannelThunk = (channel) => async dispatch => {
    const data = await api.put(`/channels/${channel.id}`, channel);

    if(data.server) {
        return data;
    }

    dispatch(updateChannel(data));
}

export const deleteChannelThunk = (channelId) => async dispatch => {
    const data = await api.delete(`/channels/${channelId}`);

    if(data.server) {
        return data;
    }

    dispatch(deleteChannel(data));
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
        case UPDATE_CHANNEL: 
            return { allIds: state.allIds, byId: {...state.byId, [action.channel.id]: action.channel }};
        case DELETE_CHANNEL: {
            const allIds = state.allIds.filter(id => +id !== +action.channelId);
            const byId = { ...state.byId };
            delete byId[action.channelId];
            return { allIds, byId }
        }
        default:
            return state;
    }
}