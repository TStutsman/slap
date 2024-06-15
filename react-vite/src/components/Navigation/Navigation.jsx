import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import Profile from "./Profile";
import ChannelList from "../ChannelList";
import Footer from '../Footer';
import WorkspaceList from '../WorkspaceList';
import "./Navigation.css";

function Navigation() {
  return (
    <div id='nav-container'>
      <WorkspaceList />
      
      <nav>
        <Profile />
        <ChannelList />
        <div id="about-links">
          <a href='https://github.com/TStutsman' target='_blank' rel='noreferrer'><FaGithub /> TStutsman</a>
          <a href='https://www.linkedin.com/in/teagan-stutsman-22a0a4237/' target='_blank' rel='noreferrer'><FaLinkedin /> Teagan Stutsman</a>
        </div>
        <Footer />
      </nav>
    </div>
  );
}

export default Navigation;
