import './Reaction.css';

function Reaction({ reaction }) {

    if(!reaction) return null;

    return (
        <button className='message-reaction'>
            {String.fromCodePoint(reaction.emoji) + ' ' + reaction.quantity}
        </button>
    );
}

export default Reaction;
