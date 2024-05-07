import { useModal } from "../../context/Modal";
import { channelSocket, messageSocket } from "../../socket";
import './ConfirmDelete.css';

function ConfirmDelete({ type='message', resourceId }) {

    // Context
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        if(type === 'channel') {
            // removes the channel from the database
            channelSocket.emit('delete_channel', resourceId);
            // removes current users from the channel
            messageSocket.emit('close_channel', resourceId);
        } else {
            messageSocket.emit('delete_message', resourceId);
        }
        closeModal();
    }

    return (
        <div id="confirm-delete-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this {type}?</p>
            <div className="delete-modal-options">
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
                <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    );
}

export default ConfirmDelete;
