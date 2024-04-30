import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './ChannelDetails.css';
import { joinChannelThunk } from '../../redux/channels';

function ChannelDetails({ channel, joined=false }) {
    const dispatch = useDispatch();

    // Context
    const { closeModal } = useModal();

    // Redux
    const users = useSelector(state => state.users);
    
    const joinChannel = () => {
        dispatch(joinChannelThunk(channel.id));
        closeModal();
    }

    const creator = users?.byId[channel.creatorId];
    const creatorName = creator?.firstName + ' ' + creator?.lastName;

    return (
        <div id="channel-details-panel">
            <div id="channel-details-header">
                <FaXmark size={25} onClick={closeModal}/>
                <h3>{channel.name}</h3>
                <div className="channel-details-buttons">
                    { !joined && 
                        <button onClick={joinChannel}>Join Channel</button>
                    }
                </div>
            </div>
            <div id="channel-details-content">
                <div id='channel-details-section-wrapper'>
                    <div className='channel-details-section'>
                        <h5>Description</h5>
                        <p>{channel.description}</p>
                    </div>
                    <div className='channel-details-section'>
                        <h5>Created By</h5>
                        <p>{creatorName} on {channel.createdAt}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChannelDetails;
