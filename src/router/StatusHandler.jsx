import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from "../components/Notification";
import { SocketContext } from '../services/socketService';
import Auth from '../services/AuthenticationService';
import { useSnackbar } from 'notistack';
import { IconButton, List, ListItem, ListItemText, Divider } from '../deps/ui';
import { Close as CloseIcon } from '../deps/ui/icons';
import ErrorModal from '../components/ErrorModal';
import { useAppSelector } from '../store/storehook';

function StatusHanlder() {
  const routeNotify = useAppSelector(state => state.resource.mutations);
  const queryNotify = useAppSelector(state => state.resource.queries);

  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [errors, setErrors] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const action = key => (
    <>
      <IconButton onClick={() => { closeSnackbar(key) }}>
        <CloseIcon />
      </IconButton>
    </>
  );

  useEffect(() => {
    const length = Object.keys(routeNotify).length;
    if (length) {
      const keyName = Object.keys(routeNotify)[length - 1];

      if (routeNotify[keyName].status === 'fulfilled') {
        const { message } = routeNotify[keyName].data;
        if (message) {
          enqueueSnackbar(message, {
            variant: "success",
            action
          });
        }
      } else if (routeNotify[keyName].status === 'rejected') {
        const { status, data: { message, result } } = routeNotify[keyName].error;
        if (Array.isArray(result)) {
          setErrors(result);
          setOpenPopup(true);
        }
        else if (message) {
          enqueueSnackbar(message, {
            variant: "error",
            action
          });
        }
        if (status === 401) {
          const info = Auth.getitem('userInfo') || {};
          const formId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1);
          sessionStorage.clear();

          socket.emit("leaveclient", info.clientId);
          socket.emit("leavecompany", info.companyId);
          socket.emit("leaveSession", formId);

          socket.off("leaveclient");
          socket.off("leavecompany");
          socket.off("leaveSession");

          navigate("/");
        }

      }

    }

    return () => {
      socket.off('leave leaveSession');
    }

  }, [routeNotify]);

  useEffect(() => {
    const length = Object.keys(queryNotify).length;
    if (length) {
      const keyName = Object.keys(queryNotify)[length - 1];

      if (queryNotify[keyName].status === 'rejected') {
        const { status } = queryNotify[keyName].error;

        if (status === 401) {
          const info = Auth.getitem('userInfo') || {};
          const formId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1);
          sessionStorage.clear();
          socket.emit("leaveclient", info.clientId);
          socket.emit("leavecompany", info.companyId);
          socket.emit("leaveSession", formId);

          socket.off("leaveclient");
          socket.off("leavecompany");
          socket.off("leaveSession");

          navigate("/");

        }

      }

    }


  }, [queryNotify]);

  return <>
    <ErrorModal title="Employee Error" openPopup={openPopup} setOpenPopup={setOpenPopup} >
      <List>
        {errors.map(error => (
          <>
            <ListItem>
              <ListItemText>{error}</ListItemText>
            </ListItem>
            <Divider />
          </>
        ))
        }
      </List>
    </ErrorModal>
    <Notification notify={notify} setNotify={setNotify} />
  </>
}

export default StatusHanlder;
