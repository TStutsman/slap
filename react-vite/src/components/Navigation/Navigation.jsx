import { useState } from "react";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { FaCaretDown } from 'react-icons/fa6'
import "./Navigation.css";

function Navigation() {
  const [showChannels, setShowChannels] = useState(true);
  const [showDMs, setShowDMs] = useState(true);

  const channels = [1, 2, 3, 4, 5, 6]
  return (
    <nav>
      <div id='profile-area'>
        <ProfileButton />
        <div id='profile-text'>
          <h3>Demo User</h3>
          <p>Status status status</p>
        </div>
      </div>
      <div id="channel-list">
        <div className='list-controls'>
          <FaCaretDown className={showChannels ? "caret" : "caret rotate"} onClick={() => setShowChannels(!showChannels)}/>
          <p>Channels</p>
          <button className="options-control">...</button>
        </div>
        { showChannels && channels.map(channel => (
          <NavLink key={channel} to="/">Channel {channel}</NavLink>
        ))}
      </div>
      <div id="dm-list">
      <div className='list-controls'>
          <FaCaretDown className={showDMs ? "caret" : "caret rotate"} onClick={() => setShowDMs(!showDMs)}/>
          <p>Direct Messages</p>
          <button className="options-control">...</button>
        </div>
        { showDMs && channels.map(dm => (
          <NavLink key={dm} to="/">Direct Message {dm}</NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
