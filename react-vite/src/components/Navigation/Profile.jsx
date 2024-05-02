import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { FaAngleDown } from 'react-icons/fa6';
import { useChannel } from "../../context/Channel";

function Profile() {
  const dispatch = useDispatch();
  const defaultPhoto = "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/profile_default.png";

  // Context
  const { setChannelId } = useChannel();

  // Redux
  const sessionUser = useSelector((store) => store.session.user);
  const users = useSelector(state => state.users);

  // Get all of the user info from users store
  // instead of session store since 'users' gets updated
  // and 'session' will not to preserve socket connection
  const user = users.byId?.[sessionUser?.id];

  // React
  const [showMenu, setShowMenu] = useState(false);

  // Element Refs
  const divRef = useRef();

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
          <button onClick={() => setChannelId(-1)}>View Profile</button>
          <button onClick={logout}>Log Out</button>
        </div>
      )}

      <div id='profile-text'>
        <h3 className="no-select">{user?.username}</h3>
        <p className="no-select">{user?.statusEmoji || '🟢'} {user?.statusString || 'Active'}</p>
      </div>

      <div className="profile-caret">
        <FaAngleDown />
      </div>
    </div>
  );
}

export default Profile;
