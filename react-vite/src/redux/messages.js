import { messageSocket } from "../socket";
import { Resock } from "./resock";

const CONNECT = 'messages/connect';
const DISCONNECT = 'messages/disconnect';
const LOAD_MESSAGES = 'messages/load_messages';
const MESSAGE_BROADCAST = 'messages/message_broadcast';
const UPDATE_BROADCAST = 'messages/updated_broadcast';
const DELETE_BROADCAST = 'messages/deleted_broadcast';

const ADD_MESSAGE_REACTION = 'messages/addReaction';

export const initializeMessageResock = () => dispatch => {
    const resock = Resock(messageSocket, 'messages', dispatch);

    // Initialize socket event listeners
    resock.addListeners([
        'connect',
        'disconnect',
        'load_messages',
        'message_broadcast',
        'updated_broadcast',
        'deleted_broadcast',
        'load_reactions',
        'reaction_broadcast'
    ]);

    // return resock object
    return resock;
}

const initialState = { byId: null, order: [], connected: false }

export default function messagesReducer(state = initialState, action) {
    switch(action.type) {
        case CONNECT:
            return { ...state, connected: true }
        case DISCONNECT:
            return { ...state, connected: false }
        case LOAD_MESSAGES:
            return { ...state, byId: action.payload.byId, order: action.payload.order }
        case MESSAGE_BROADCAST:
            return { 
                ...state, 
                byId: { ...state.byId, [action.payload.id]: action.payload }, 
                order: [...state.order, action.payload.id]
            }
        case UPDATE_BROADCAST:
            return {
                ...state,
                byId: { ...state.byId, [action.payload.id]: action.payload }
            }
        case DELETE_BROADCAST:{
            const i = state.order.indexOf(action.payload);
            const order = [...state.order.slice(0, i), ...state.order.slice(i + 1)];
            delete state.byId[action.payload]
            return { ...state, order }
        }

        case ADD_MESSAGE_REACTION: {
            state.byId[action.payload.messageId].reactions = [...state.byId[action.payload.messageId].reactions, action.payload.id];
            return { ...state }
        }

        default:
            return state;
    }
}