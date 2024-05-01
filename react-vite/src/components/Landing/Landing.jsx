import LoginFormModal from '../LoginFormModal';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import { Modal } from '../../context/Modal';
import './Landing.css';

function Landing() {
    return (
        <div id='landing'>
            <div id='landing-intro'>
                <h1>Slap!</h1>
                <p>The messaging service for teams who need incredible, mind-blowing performance 🤯</p>
            </div>
            <div id='landing-buttons'>
                <OpenModalButton
                    modalComponent={<LoginFormModal />}
                    buttonText={"Log In"}
                />
                <OpenModalButton
                    modalComponent={<SignupFormModal />}
                    buttonText={"Sign Up"}
                />
            </div>
            <h2 id='background-slap'>Slap!</h2>
            <Modal />
        </div>
    );
}

export default Landing;