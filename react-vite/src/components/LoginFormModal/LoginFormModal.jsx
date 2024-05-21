import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import Loading from '../Loading';
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Tell the user we're waiting for the server

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    setLoading(false);
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    await dispatch(thunkLogin({ email:'demo@aa.io', password:'password' }));
    setLoading(false);
    closeModal();
  }

  return (
    <div className="login-modal">
      { loading ? 
        <Loading />
      :
      <>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="error">{errors.password}</p>}
          <button type="submit">Log In</button>
        </form>
        <button className="demo" onClick={demoLogin}>Demo User</button>
      </>
      }
    </div>
  );
}

export default LoginFormModal;
