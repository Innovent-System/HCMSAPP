import {useEffect,useRef,useContext, useState} from 'react';
import { SocketContext } from '../services/socketService';

const bindMethod = (dataSet = [],data = {},columnsName = {}) => {
    if(!data || !Array.isArray(dataSet))  return;
    const dataList = dataSet.slice();
    let newSet = {};
    if(data){
            
            const {operationType,fullDocument,documentKey} = data;
            if(typeof(columnsName) === 'object' &&  Object.keys(columnsName).length)
            {
                const mapObject = {};
                Object.keys(fullDocument).map(key => {
                    if(key in columnsName){
                      return mapObject[key] = fullDocument[key];
                    }
                });

                newSet = mapObject;              
            }
            else{
                newSet = fullDocument;
            }
           
            
            switch (operationType) {
                case "update":
                        const updateIndex = dataList.findIndex(f => f.id === documentKey._id);
                        dataList.splice(updateIndex,1,...newSet)
                    break;
                case "delete":
                    const deleteIndex = dataList.findIndex(f => f.id === documentKey._id);
                    dataList.splice(deleteIndex,1);
                    
                    break;    
                default:
                    dataList.unshift(newSet);
                    break;
            }            
          
    }
    
    return dataList;
    
}

const formId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1);

export const useSocketIo = (state = [],setState,emitCallName = '') => {

    const socket = useContext(SocketContext);
    const recordsRef = useRef(state);

    useEffect(() => {
        recordsRef.current = state;
      });
    
    useEffect(() => {
      socket.emit("joinSession",formId);

      return () => {
        socket.emit("leaveSession",formId);
      }
    }, [])
 
    useEffect(() => {
      
      const handler =  (changes) => {
        const newsets = bindMethod(recordsRef.current.data,changes);
        setState({...recordsRef.current.data,data:newsets});
      };
  
      socket.on("changes_occures_" + emitCallName, handler);
  
      return () => {
        socket.off('changes_occures_' + emitCallName,handler);
      }
    }, [socket,state?.data,setState,emitCallName])
    
}

