import { FaGithub, FaLinkedin } from 'react-icons/fa6'
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
      <div id="about-links">
        <a href='https://github.com/TStutsman' target='_blank' rel='noreferrer'><FaGithub /> TStutsman</a>
        <a href='https://www.linkedin.com/in/teagan-stutsman-22a0a4237/' target='_blank' rel='noreferrer'><FaLinkedin /> Teagan Stutsman</a>
      </div>
    </nav>
  );
}

export default Navigation;
