import {useEffect,useContext} from 'react';
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


export const useSocketIo = (gridMethod = () => {}) => {

    const socket = useContext(SocketContext);
    // const recordsRef = useRef(state);

    // useEffect(() => {
    //     recordsRef.current = state;
    //   });
    
 
    useEffect(() => {
      
      const handler =  (changes) => {
        gridMethod();
        // const newsets = bindMethod(recordsRef.current.data,changes);
        // setState({...recordsRef.current.data,data:newsets});
      };
  
      socket.on("changes_occures", handler);
  
      return () => {
        socket.off('changes_occures',handler);
      }
    }, [socket,gridMethod])
    
}

