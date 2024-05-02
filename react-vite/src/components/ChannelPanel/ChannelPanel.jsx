import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChannel } from '../../context/Channel';
import { joinChannelThunk } from '../../redux/channels';
import { socket } from '../../socket';
import { FaAngleDown } from 'react-icons/fa6';
import OpenModalButton from '../OpenModalButton';
import MessageFeed from '../MessageFeed/MessageFeed';
import MessageInput from '../MessageInput';
import ChannelDetails from '../ChannelDetails';
import ProfilePanel from '../ProfilePanel';
import './ChannelPanel.css';

function ChannelPanel() {
    const dispatch = useDispatch();

    // Context
    const { channelId } = useChannel();

    // Redux Store
    const sessionUser = useSelector(state => state.session.user);
    const users = useSelector(state => state.users);
    const channels = useSelector(state => state.channels);

    // React
    const [joined, setJoined] = useState(false);

    // Opens the socket after user is logged in
    useEffect(() => {
        if(sessionUser !== null) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        }
    }, [sessionUser]);

    // For rendering whether the user has joined the channel
    useEffect(() => {
        setJoined(channels.joined?.has(+channelId));
    }, [channels, channelId]);

    const joinChannel = () => {
        dispatch(joinChannelThunk(channelId));
    }

    // Wait for dispatch to load
    if(!channels.byId) return null;

    // Convenience variable for accessing channel info
    const currentChannel = channels.byId[channelId];

    return (
        <div id="channel-panel">
            { channelId === -1 ?
                <ProfilePanel user={users.byId?.[sessionUser?.id]} />
            : currentChannel ?
            <>
                <div id='channel-details'>
                    <OpenModalButton
                        buttonText={<h3>{currentChannel.name} <FaAngleDown size={12}/></h3>}
                        modalComponent={ <ChannelDetails channel={currentChannel} joined={joined} /> }
                    />
                    <p>{currentChannel.numUsers} members</p>
                </div>
                <MessageFeed channelId={channelId}/>

                {joined ?
                    <MessageInput sessionUser={sessionUser} />
                    :
                    <div className='join-channel-panel'>
                        <div className='join-channel-wrapper'>
                            <h4 className='no-select'># {currentChannel.name}</h4>
                            <div className='join-channel-options'>
                                <OpenModalButton 
                                    buttonText={'Details'}
                                    modalComponent={<ChannelDetails channel={currentChannel} />}
                                />
                                <button className='no-select' onClick={joinChannel}>Join Channel</button>
                            </div>
                        </div>
                    </div>
                }
            </>
            :
            <div id='channel-details'>
                <h3>No Channel Selected</h3>
            </div>
            }
        </div>
    )
}

export default ChannelPanel;