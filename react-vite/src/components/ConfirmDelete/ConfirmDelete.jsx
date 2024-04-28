import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { socket } from "../../socket";
import { deleteChannelThunk } from "../../redux/channels";

function ConfirmDelete({ type='message', resourceId }) {
    const dispatch = useDispatch();

    // Context
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        if(type === 'channel') {
            dispatch(deleteChannelThunk(resourceId))
        } else {
            socket.emit('delete_message', resourceId);
        }
        closeModal();
    }

    return (
        <div id="confirm-delete-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this {type}?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={closeModal}>Cancel</button>
        </div>
    );
}

export default ConfirmDelete;
