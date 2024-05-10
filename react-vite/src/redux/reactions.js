const LOAD_REACTIONS = 'messages/load_reactions';
const REACTION_BROADCAST = 'messages/reaction_broadcast';

const initialState = { byId: null, allIds: [] }

export default function reactionsReducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_REACTIONS:
            return { ...state, byId: action.payload.byId, allIds: action.payload.allIds }
        case REACTION_BROADCAST:
            return { ...state, byId: { ...state.byId, [action.payload.id]: action.payload }, allIds: [ ...state.allIds, action.payload.id ] }
        default:
            return state
    }
}