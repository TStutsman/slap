import Fetcher from "./fetcher";
const api = new Fetcher('/api');

const ADD_CHANNELS = 'channels/addChannels';
const ADD_ONE_CHANNEL = 'channels/addOneChannel';
const UPDATE_CHANNEL = 'channels/updateChannel';
const DELETE_CHANNEL = 'channels/deleteChannel';
const JOIN_CHANNEL = 'channels/joinChannel';

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

export const deleteChannel = channel => ({
    type: DELETE_CHANNEL,
    channelId: channel.id
});

const joinChannel = channel => ({
    type: JOIN_CHANNEL,
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
    return data;
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

export const joinChannelThunk = (channelId) => async dispatch => {
    const data = await api.post(`/channels/${channelId}/join`);

    if(data.server) {
        return data
    }

    dispatch(joinChannel(data));
}

const initial = { byId: null, allIds: [], joined: null }

export default function channelsReducer(state = initial, action) {
    switch(action.type) {
        case ADD_CHANNELS:
            return { byId: action.channels.byId, allIds: action.channels.allIds, joined: new Set(action.channels.joined) };

        case ADD_ONE_CHANNEL: {
            state.byId[action.channel.id] = action.channel;
            state.allIds.push(action.channel.id);
            state.joined.add(action.channel.id);

            // update the location of state in memory
            // for useSelectors to rerender
            return { ...state };
        }
        
        case UPDATE_CHANNEL: 
            return { ...state, byId: {...state.byId, [action.channel.id]: action.channel }};
        
        case DELETE_CHANNEL: {
            const allIds = state.allIds.filter(id => +id !== +action.channelId);
            delete state.byId[action.channelId];
            state.joined.delete(action.channelId);
            return { ...state, allIds };
        }

        case JOIN_CHANNEL: {
            const newState = { ...state, byId: {...state.byId, [action.channel.id]: action.channel} };
            newState.joined.add(action.channel.id);
            return newState;
        }

        default:
            return state;
    }
}