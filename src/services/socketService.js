import { createContext } from 'react';
import socketio from 'socket.io-client';


const SOCKET_URL = 'http://localhost:5000/';

export const appsocket = socketio(SOCKET_URL);


export const SocketContext = createContext();

