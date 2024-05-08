import Fetcher from "./fetcher";
const api = new Fetcher('/api');

import { channelSocket } from "../socket";
import { Resock } from "./resock";

const ADD_CHANNELS = 'channels/addChannels';
const ADD_ONE_CHANNEL = 'channels/addOneChannel';
const UPDATE_CHANNEL = 'channels/updateChannel';
const DELETE_CHANNEL = 'channels/deleteChannel';
const JOIN_CHANNEL = 'channels/joinChannel';

// events
const CHANNEL_UPDATE = 'channels/channel_broadcast';
const CHANNEL_DELETED = 'channels/channel_deleted';

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

    // only run the dispatch if there wasn't an error
    if(!data.errors) dispatch(addOneChannel(data));

    // always return the data (errors or not)
    return data;
}

export const editChannelThunk = (channel) => async dispatch => {
    const data = await api.put(`/channels/${channel.id}`, channel);

    // only run the dispatch if there wasn't an error
    if(!data.server) dispatch(updateChannel(data));

    // always return the data (errors or not)
    return data;
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

export const initializeChannelResock = () => dispatch => {
    const resock = Resock(channelSocket, 'channels', dispatch);

    // Initialize socket event listeners
    resock.addListeners(['channel_broadcast', 'channel_deleted']);

    // return resock object
    return resock;
}

const initial = { byId: null, allIds: [], joined: null }

export default function channelsReducer(state = initial, action) {
    switch(action.type) {
        case ADD_CHANNELS:
            return { 
                byId: action.channels.byId, 
                allIds: action.channels.allIds, 
                joined: new Set(action.channels.joined) 
            };

        case ADD_ONE_CHANNEL: {
            state.byId[action.channel.id] = action.channel;
            state.allIds.push(action.channel.id);
            state.joined.add(action.channel.id);

            // update the location of state in memory
            // for useSelectors to rerender
            return { ...state };
        }
        
        case UPDATE_CHANNEL: 
            return { 
                ...state, 
                byId: {...state.byId, [action.channel.id]: action.channel }
            };
        
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

        // ____ SOCKET EVENTS _____

        case CHANNEL_DELETED: {
            const allIds = state.allIds.filter(id => +id !== +action.payload.id);
            delete state.byId[action.payload.id];
            state.joined.delete(action.payload.id);
            return { ...state, allIds };
        }

        case CHANNEL_UPDATE: {
            // if the channel doesn't exist, add id to allIds
            if(!state.byId[action.payload.id]){
                state.allIds.push(action.payload.id);
            }
            state.byId[action.payload.id] = action.payload;

            // update the location of state in memory
            // for useSelectors to rerender
            return { ...state };
        }

        default:
            return state;
    }
}