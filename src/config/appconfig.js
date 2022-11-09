import { createBrowserHistory } from 'history';
import Auth from '../services/AuthenticationService';


export const history = createBrowserHistory();


// export const domain = 'http://13.230.226.16:5000/api/';
// export const socketUrl = "http://13.230.226.16:5000/";

export const domain = 'http://localhost:5000/api/';
export const socketUrl = "http://localhost:5000/";

export const headerOption = () => {
  const info = Auth.getitem('userInfo') || {};
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    'formid': window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1),
    'clientid': info.clientId
  }
};