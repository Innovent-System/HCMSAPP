import { useState,useEffect,useContext } from 'react'
import Notification from "../components/Notification";
import { useSelector } from "react-redux";
import { history } from '../config/appconfig';
import {SocketContext} from '../services/socketService';
import Auth from '../services/AuthenticationService';
import { useSnackbar } from 'notistack';
import { Button,IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function StatusHanlder() {
    const routeNotify = useSelector((state => state[Object.keys(state)[0]]));
    const socket = useContext(SocketContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
      });

      const action = key => (
        <>
            <IconButton onClick={() => { closeSnackbar(key) }}>
               <CloseIcon/>
            </IconButton>
        </>
    );
    
      useEffect(() => {
       if(routeNotify.error.flag || routeNotify.status){

        const message = routeNotify.error.flag ? routeNotify.error.msg : routeNotify.message;
        if(message){
          enqueueSnackbar(message,{
            variant: routeNotify.error.flag ? "error" : "success",
            action
          });
        }
        
        // setNotify({
        //   isOpen: (routeNotify.error.flag || routeNotify.status),
        //   message: routeNotify.error.flag ? routeNotify.error.msg : routeNotify.message,
        //   type: routeNotify.error.flag ? "error" : "success"
        // });

        if(routeNotify.error.code === 401){
          const info = Auth.getitem('userInfo') || {};
          const formId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1);
          localStorage.clear();
          history.push("/");
          socket.emit("leave",info.c_Id);
          socket.emit("leaveSession",formId);
        }
       }
       
       return () => {
        socket.off('leave leaveSession');
       }
        
      }, [routeNotify]);


    return <Notification notify={notify} setNotify={setNotify} />
}

export default StatusHanlder;
