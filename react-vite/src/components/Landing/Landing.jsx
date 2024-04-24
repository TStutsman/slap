import LoginFormModal from '../LoginFormModal';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import { Modal } from '../../context/Modal';
import './Landing.css';

function Landing() {
    return (
        <div id='landing'>
            <h1>Welcome to Slap!</h1>
            <OpenModalButton
                modalComponent={<LoginFormModal />}
                buttonText={"Log In"}
            />
            <OpenModalButton
                modalComponent={<SignupFormModal />}
                buttonText={"Sign Up"}
            />
            <Modal />
        </div>
    );
}

export default Landing;