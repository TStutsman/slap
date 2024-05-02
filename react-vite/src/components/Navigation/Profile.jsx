import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { updateProfileThunk } from "../../redux/users";
import { FaAngleDown } from 'react-icons/fa6';
import { useChannel } from "../../context/Channel";

function Profile() {
  const dispatch = useDispatch();
  const defaultPhoto = "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/profile_default.png";

  // Context
  const { setChannelId } = useChannel();

  // Redux
  const user = useSelector((store) => store.session.user);
  const users = useSelector(state => state.users);

  // React
  const [showMenu, setShowMenu] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(user.statusString || '');

  // Element Refs
  const divRef = useRef();
  const statusRef = useRef();

  // Toggle the logout menu
  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  // Close dropdown on click anywhere off-menu
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);


  // Close profile input on click anywhere off-input
  useEffect(() => {
    if (!updating) return;

    const closeInput = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setUpdating(false);
      }
    };

    document.addEventListener("click", closeInput);

    return () => document.removeEventListener("click", closeInput);
  }, [updating]);



  const beginStatusUpdate = () => {
    setUpdating(true);
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    const profile = {
      statusEmoji: '🟢',
      statusString: status
    }

    dispatch(updateProfileThunk(profile));
    setUpdating(false);
    setShowMenu(false);
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    setShowMenu(false);
  };

  return (
    <div id='profile-area' onClick={toggleMenu}>
      <div id='user-profile'>
        <img src={ user?.profilePhotoUrl || defaultPhoto } alt="profile_default" />
      </div>
      {showMenu && (
        <div className={"profile-dropdown"} ref={divRef}>
          <button onClick={() => setChannelId(-1)}>Profile</button>
          <button onClick={beginStatusUpdate}>Update Status</button>
          <button onClick={logout}>Log Out</button>
        </div>
      )}

      <div id='profile-text'>
        <h3 className="no-select">{user.username}</h3>
        { updating ? 
          <form onSubmit={handleProfileUpdate}>
            <input
              type="text"
              id="profile-status-input"
              onClick={e => e.stopPropagation()}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Status"
              autoFocus
              ref={statusRef}
            />
            <input type="submit" style={{display: 'none'}}/>
          </form>
          :
          <p className="no-select">{users?.byId?.[user.id]?.statusEmoji || '🟢'} {users?.byId?.[user.id]?.statusString || 'Active'}</p>
        }
      </div>

      <div className="profile-caret">
        <FaAngleDown />
      </div>
    </div>
  );
}

export default Profile;
