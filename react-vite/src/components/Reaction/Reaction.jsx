import { messageSocket } from '../../socket';
import './Reaction.css';

function Reaction({ reaction, userId }) {

    const toggleReaction = () => {
        const payload = {
            userId,
            ...reaction
        }

        if(reaction.userIds.includes(userId)) {
            messageSocket.emit('reaction_decrement', payload)
        } else {
            messageSocket.emit('reaction_increment', payload)
        }
    }

    if(!reaction) return null;

    return (
        <button className={'message-reaction' + (reaction.userIds.includes(userId) ? ' reacted' : '')}onClick={toggleReaction}>
            {String.fromCodePoint(reaction.emoji) + ' ' + reaction.quantity}
        </button>
    );
}

export default Reaction;
