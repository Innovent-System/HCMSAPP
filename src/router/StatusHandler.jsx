import { useState,useEffect,useContext } from 'react'
import Notification from "../components/Notification";
import { useSelector } from "react-redux";
import { history } from '../config/appconfig';
import {SocketContext} from '../services/socketService'



function StatusHanlder() {
    const routeNotify = useSelector((state => state[Object.keys(state)[0]]));
    const socket = useContext(SocketContext);
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
      });
    
      useEffect(() => {
       if(routeNotify.error.flag || routeNotify.status){
        setNotify({
          isOpen: (routeNotify.error.flag || routeNotify.status),
          message: routeNotify.error.flag ? routeNotify.error.msg : routeNotify.message,
          type: routeNotify.error.flag ? "error" : "success"
        });

        if(routeNotify.error.code === 401){
          localStorage.clear();
          history.push("/");
          socket.emit("leave",1);
        }
       } 
        
      }, [routeNotify]);


    return <Notification notify={notify} setNotify={setNotify} />
}

export default StatusHanlder;
