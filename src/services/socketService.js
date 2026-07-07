import * as signalR from '@microsoft/signalr';
import { createContext } from 'react';
import { socketUrl } from '../config/appconfig';
import Auth from '../services/AuthenticationService';

// ✅ SignalR connection — Socket.IO ki jagah
export const appsocket = new signalR.HubConnectionBuilder()
    .withUrl(`${socketUrl}/hub`, {
        accessTokenFactory: () => {
             const info = Auth.getitem('userInfo') || {};
             return info.token;
        } 
    })
    .withAutomaticReconnect()
    .build();

// Start karo
//appsocket.start().catch(err => console.error('SignalR Error:', err));

export const SocketContext = createContext();


// import { createContext } from 'react';
// import socketio from 'socket.io-client';
// import { socketUrl } from '../config/appconfig';



// export const appsocket = socketio(socketUrl, { autoConnect: true });

// export const SocketContext = createContext();