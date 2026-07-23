import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from "../components/Notification";
import { SocketContext } from '../services/socketService';
import Auth from '../services/AuthenticationService';
import { useSnackbar, closeSnackbar } from 'notistack';
import { IconButton, List, ListItem, ListItemText, Divider } from '../deps/ui';
import { Close as CloseIcon } from '../deps/ui/icons';
import ErrorModal from '../components/ErrorModal';
import { useAppDispatch, useAppSelector } from '../store/storehook';
import { setAppError, setGlobalLoader } from '../store/actions/httpactions';

export const CloseSnackBar = (key) => (
  <IconButton onClick={() => closeSnackbar(key)} size="small">
    <CloseIcon fontSize="small" />
  </IconButton>
);

function StatusHanlder() {
  // const routeNotify = useAppSelector(state => state.resource.mutations);
  // const queryNotify = useAppSelector(state => state.resource.queries);


  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const [errors, setErrors] = useState([]);
  // const [openPopup, setOpenPopup] = useState(false);
  const { errors, showModal } = useAppSelector(e => e.appdata.appError);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleErrorModal = () => {
    dispatch(setAppError({ errors: [], showModal: false }));
  }

  // const action = key => (
  //   <>
  //     <IconButton onClick={() => { closeSnackbar(key) }}>
  //       <CloseIcon />
  //     </IconButton>
  //   </>
  // );

  // useEffect(() => {
  //   const length = Object.keys(routeNotify).length;
  //   if (length) {
  //     const keyName = Object.keys(routeNotify)[length - 1];
  //     if (routeNotify[keyName].status === "pending") {
  //       dispatch(setGlobalLoader(true))
  //     }
  //     else if (routeNotify[keyName].status === 'fulfilled') {
  //       dispatch(setGlobalLoader(false))
  //       const { message } = routeNotify[keyName].data;
  //       if (message) {
  //         enqueueSnackbar(message, {
  //           variant: "success",
  //           action
  //         });
  //       }
  //     } else if (routeNotify[keyName].status === 'rejected') {
  //       dispatch(setGlobalLoader(false))
  //       const { status, data } = routeNotify[keyName].error;
  //       if (data) {
  //         const { message, result, errors } = data;
  //         if (Array.isArray(result)) {
  //           setErrors(result);
  //           setOpenPopup(true);
  //         }
  //         // else if(errors){
  //         //   setErrors(Object.values(errors).flat());
  //         //   setOpenPopup(true);
  //         // }
  //         else if (message) {
  //           enqueueSnackbar(message, {
  //             variant: "error",
  //             action
  //           });
  //         }
  //       }


  //       if (status === 401) {
  //         socket.stop();
  //         sessionStorage.clear();
  //         navigate("/");
  //       }

  //     }

  //   }


  // }, [routeNotify]);

  // useEffect(() => {
  //   const length = Object.keys(queryNotify).length;
  //   if (length) {
  //     const keyName = Object.keys(queryNotify)[length - 1];

  //     // if (queryNotify[keyName].status === "pending") dispatch(setGlobalLoader(true))
  //     // else if (queryNotify[keyName].status === 'fulfilled') dispatch(setGlobalLoader(false))
  //     if (queryNotify[keyName].status === 'rejected') {
  //       // dispatch(setGlobalLoader(false))
  //       const { status, data } = queryNotify[keyName]?.error;
  //       if (data) {
  //         const { message, result } = data;
  //         if (Array.isArray(result)) {
  //           setErrors(result);
  //           setOpenPopup(true);
  //         }
  //         else if (message) {
  //           enqueueSnackbar(message, {
  //             variant: "error",
  //             action
  //           });
  //         }
  //       }


  //       if (status === 401) {
  //         socket.stop();
  //         sessionStorage.clear();
  //         navigate("/");
  //       }

  //     }

  //   }


  // }, [queryNotify]);

  return <>
    <ErrorModal title="Employee Error" openPopup={showModal} setOpenPopup={handleErrorModal} >
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
