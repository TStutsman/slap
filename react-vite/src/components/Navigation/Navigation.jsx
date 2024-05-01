import Profile from "./Profile";
import ChannelList from "../ChannelList";
import DMList from "../DMList";
import "./Navigation.css";

function Navigation() {
  return (
    <nav>
      <Profile />
      <ChannelList />
      <DMList />
    </nav>
  );
}

export default Navigation;
