import { createContext } from 'react';
import socketio from 'socket.io-client';
import {socketUrl} from '../config/appconfig';


export const appsocket = socketio(socketUrl,{autoConnect:false});

export const SocketContext = createContext();

