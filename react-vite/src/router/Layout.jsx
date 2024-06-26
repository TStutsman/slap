import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Landing from "../components/Landing";
import Loading from "../components/Loading";
import Navigation from "../components/Navigation";
import { ChannelProvider } from "../context/Channel";
import { Modal, ModalProvider } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import { WorkspaceProvider } from "../context/Workspace";

export default function Layout() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    { isLoaded ?
      <ModalProvider>
        { sessionUser !== null ?
          <WorkspaceProvider>
            <ChannelProvider>
              <Navigation />
              { isLoaded && <Outlet /> }
            </ChannelProvider>
          </WorkspaceProvider>
          :
          <Landing />
        }
        <Modal /> 
      </ModalProvider>
      :
      <Loading />
    }
    </>
  );
}
