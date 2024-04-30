import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";

function Profile() {
  const dispatch = useDispatch();
  const defaultPhoto = "https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/profile_default.png";

  // Redux
  const user = useSelector((store) => store.session.user);

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

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <div id='profile-area'>
      <div id='user-profile' onClick={toggleMenu}>
        <img src={ user?.profilePhotoUrl || defaultPhoto } alt="profile_default" />
      </div>
      {showMenu && (
        <div className={"profile-dropdown"} ref={divRef}>        
                <button onClick={logout}>Log Out</button>   
        </div>
      )}

      <div id='profile-text'>
        <h3>{user.username}</h3>
        <p>{user.statusEmoji} {user.statusString}</p>
      </div>
    </div>
  );
}

export default Profile;
