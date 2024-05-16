import { emojiCodes } from '../../utils/emojiCodes';
import { messageSocket } from '../../socket';
import './EmojiPicker.css';

function EmojiPicker({ emojiPickerRef, setOpen, messageId, userId }) {

    const addReaction = unicode => {
        const reaction = {
            userId,
            messageId,
            emoji: unicode
        }

        messageSocket.emit('new_reaction', reaction)
        setOpen(false);
    }

    return (
        <div className='emoji-picker' ref={emojiPickerRef}>
            { emojiCodes.map(unicode => (
                <button key={unicode} className='emoji-btn' onClick={() => addReaction(unicode)}>
                    {String.fromCodePoint(unicode)}
                </button>
            ))}
        </div>
    );
}

export default EmojiPicker;
