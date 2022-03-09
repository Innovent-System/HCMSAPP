import { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../services/socketService';

export const useSocketIo = (eventName = "", fetchData) => {

  const socket = useContext(SocketContext);
  const [socketData, setSocketData] = useState(null);

  useEffect(() => {

    const handler = (changes) => {
      if (Array.isArray(changes) && changes.length) {
        const [data, count] = changes;
        setSocketData(data);
      }
      else {
        if (typeof fetchData === 'function') {
          fetchData();
        }
      }
    }

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    }
  }, [socket])

  return {
    socketData
  }
}