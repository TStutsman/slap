import './Message.css';

function Message({ user, message }) {
    const author = user ? user : {
        firstName: 'unknown',
        lastName: '',
        profilePhotoUrl: "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/profile_default.png"
    }

    if(!message) return null;

    return (
        <div className='message'>
            <div className='profile-photo'>
                <img src={author.profilePhotoUrl} alt="profile_photo" />
            </div>
            <div className='content'>
                <h6>{author.firstName} {author.lastName}</h6>
                <p>{message.content}</p>
            </div>
        </div>
    );
}

export default Message;
