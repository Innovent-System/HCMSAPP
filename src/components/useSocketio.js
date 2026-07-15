import { useEffect, useContext, useState, useRef, useEffectEvent } from 'react';
import { SocketContext } from '../services/socketService';

// export const useSocketIo = (eventName = "", fetchData) => {

//   const socket = useContext(SocketContext);
//   const [socketData, setSocketData] = useState(null);

//   useEffect(() => {

//     const handler = (changes) => {
//       if (Array.isArray(changes) && changes.length) {
//         const [data, count] = changes;
//         setSocketData(data);
//       }
//       else {
//         if (typeof fetchData === 'function') {
//           fetchData();
//         }
//       }
//     }

//     socket.on(eventName, handler);

//     return () => {
//       socket.off(eventName, handler);
//     }
//   }, [socket])

//   return {
//     socketData,
//     socket
//   }
// }


export const useSocketIo = (eventName, fetchData) => {

  const socket = useContext(SocketContext);
  const [socketData, setSocketData] = useState(null);
  const cbRef = useRef(fetchData);
  
  useEffect(() => {
    cbRef.current = fetchData;
  }, [fetchData]);

  const handleEvent = useEffectEvent((data) => {
    if (Array.isArray(data) && data.length)
      setSocketData(data);
    else if (typeof fetchData === 'function') {
      cbRef.current();
    }

  })



  useEffect(() => {
    if (!eventName || !socket) return;

    // socket.off(eventName, handleEvent);
    socket.on(eventName, handleEvent);

    return () => {
      socket.off(eventName, handleEvent);
    };
  }, [socket, eventName]);

  return { socketData, socket };
};