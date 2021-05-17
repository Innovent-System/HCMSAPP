import { useState,useEffect } from 'react'
import Notification from "../components/Notification";
import { useSelector } from "react-redux";



function StatusHanlder() {
    const routeNotify = useSelector((state => state[Object.keys(state)[0]]));

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

       } 
        
      }, [routeNotify]);


    return <Notification notify={notify} setNotify={setNotify} />
}

export default StatusHanlder;
