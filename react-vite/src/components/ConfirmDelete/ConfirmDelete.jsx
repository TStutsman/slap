import { useModal } from "../../context/Modal";
import { socket } from "../../socket";

function ConfirmDelete({ messageId }) {
    // Context
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        socket.emit('delete_message', messageId);
        closeModal();
    }

    return (
        <div id="confirm-delete-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this message?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={closeModal}>Cancel</button>
        </div>
    );
}

export default ConfirmDelete;
