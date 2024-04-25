import Fetcher from "./fetcher";
const api = new Fetcher('/api');

const ADD_MESSAGES = 'messages/addMessages';

const addMessages = messages => ({
    type: ADD_MESSAGES,
    messages
});

export const getChannelMessagesThunk = channelId => async dispatch => {
    const data = await api.get(`/channels/${channelId}/messages`);

    if(data.server) {
        return data;
    }

    dispatch(addMessages(data));
}

const initialState = { byId: null, allIds: [] }

export default function messagesReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_MESSAGES:
            return { ...action.messages }
        default:
            return state;
    }
}