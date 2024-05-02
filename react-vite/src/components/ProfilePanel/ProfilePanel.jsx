import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaPencil, FaRegEnvelope } from 'react-icons/fa6';
import { updateProfilePhotoThunk } from '../../redux/users';
import './ProfilePanel.css';

function ProfilePanel({ user }) {
    const dispatch = useDispatch();
    const defaultPhoto = "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/default_profile_large.png";

    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState("");
    const [image, setImage] = useState();
    const [tempUrl, setTempUrl] = useState('');

    const formRef = useRef();

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        alert(status);
        setStatus('');
        setEditing(false);
    }

    const handleImageUpload = (e) => {
        const upload = e.target.files[0];
        setImage(upload);
        setTempUrl(URL.createObjectURL(upload))
    }

    const cancelUpload = () => {
        URL.revokeObjectURL(tempUrl);
        setTempUrl('');
        setImage(null);
        formRef.current.reset();
        // ^^ this line clears out the file input
        // meaning we can still choose the same file
        // after initially cancelling
    }

    const saveUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);
        const data = await dispatch(updateProfilePhotoThunk(formData));
        
        if(data.errors) return console.log(data.errors);

        // If the image successfully updated
        // clean up state
        URL.revokeObjectURL(tempUrl);
        setTempUrl('');
        setImage(null);
        formRef.current.reset();
    }

    return (
        <div id='profile-panel'>
            <div id='profile-panel-img'>
                <div className='profile-panel-img-wrapper'>
                    { image ? 
                        <img src={tempUrl || defaultPhoto} alt="" />
                        :
                        <img src={user.profilePhotoUrl || defaultPhoto} alt="" />
                    }
                    <form ref={formRef} encType='multipart/form-data'>
                        <label>
                            { !image && <div className='upload-profile-photo'>{ user.profilePhotoUrl ? 'Change Photo' : 'Upload Photo' }</div>}
                            <input
                                type="file"
                                accept='image/*'
                                onChange={handleImageUpload}
                            />
                        </label>
                    </form>
                    { image && 
                        <>
                            <div className='upload-profile-photo cancel' onClick={cancelUpload}>Cancel</div>
                            <div className='upload-profile-photo save' onClick={saveUpload}>Save</div>
                        </>
                    }
                </div>
            </div>

            <div id='profile-panel-info'>
                <h2>{user.firstName} {user.lastName}</h2>
                <div className={'profile-info-status' + (editing ? ' edit' : '')}>
                    <p>{user.statusEmoji}</p>
                    <p>{user.statusString}</p>
                    <FaPencil onClick={() => setEditing(!editing)}/>
                </div>
                { editing &&
                    <form onSubmit={handleStatusUpdate}>
                        <input 
                            className='status-input'
                            type="text" 
                            value={status} 
                            onChange={e => setStatus(e.target.value)}
                            placeholder='Set your status'
                        />
                        <input type="submit" style={{display: 'none'}}/>
                    </form>
                }
            </div>

            <div id='profile-panel-contact'>
                <h3>Contact Details</h3>
                <div className='contact-detail'>
                    <div className='contact-details-icon'>
                        <FaRegEnvelope size={40}/>
                    </div>
                    <div className='contact-details-text'>
                        <h6>Email address</h6>
                        <p>{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePanel;
