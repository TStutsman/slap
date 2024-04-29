import ProfileButton from "./ProfileButton";
import ChannelList from "../ChannelList";
import DMList from "../DMList";
import "./Navigation.css";

function Navigation() {
  return (
    <nav>
      <div id='profile-area'>
        <ProfileButton />
        <div id='profile-text'>
          <h3>Demo User</h3>
          <p>Status status status</p>
        </div>
      </div>
      <ChannelList />
      <DMList />
    </nav>
  );
}

export default Navigation;
