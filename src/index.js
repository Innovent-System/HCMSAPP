// eslint-disable-next-line import/no-anonymous-default-export
// eslint-disable-next-line no-restricted-globals
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
