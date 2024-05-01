import { useModal } from '../../context/Modal';
import './ChannelWasDeleted.css';

function ChannelWasDeleted() {
    const { closeModal } = useModal();

    return (
        <div id="deleted-channel-popup">
            <h3>This channel has been deleted</h3>
            <button onClick={closeModal}>OK</button>
        </div>
    );
}

export default ChannelWasDeleted;
