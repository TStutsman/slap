import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalProvider } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation";
import Landing from "../components/Landing";
import Loading from "../components/Loading";
import { ChannelProvider } from "../context/Channel";

export default function Layout() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    setLoggedIn(!!sessionUser)
  }, [sessionUser])

  return (
    <>
    { isLoaded ?
      <ChannelProvider>
        <ModalProvider>
          { !loggedIn ? 
            <Landing /> : 
            <>
                <Navigation />
                { isLoaded && <Outlet /> }
            </>
          }
          <Modal /> 
        </ModalProvider>
      </ChannelProvider> :
      <Loading />
    }
    </>
  );
}
