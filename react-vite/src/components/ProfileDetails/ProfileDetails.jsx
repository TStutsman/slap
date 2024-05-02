import './ProfileDetails.css';

function ProfileDetails({ user }) {
    const defaultPhoto = "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/profile_default.png";

    return (
        <div className='profile-details'>
            <div className='profile-photo'>
                <img src={user.profilePhotoUrl || defaultPhoto} alt="profile-photo" />
            </div>

            <div className='profile-text'>
                <h3 className='no-select details-name'>{user.firstName} {user.lastName}</h3>
                <h4 className="no-select details-username">@{user.username}</h4>
                <p className="no-select details-status">{user.statusEmoji || '🟢'} {user.statusString || 'Active'}</p>
            </div>
        </div>
    );
}

export default ProfileDetails;
