// import { createBrowserHistory } from 'history';
import Auth from '../services/AuthenticationService';


// export const history = createBrowserHistory();


// export const domain = 'http://55.55.55.106:5000/api/';
// export const socketUrl = "http://55.55.55.106:5000/";
const BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'http://localhost:5000'

export const domain = `${BASE_URL}/api/`;
export const socketUrl = BASE_URL;

export const headerOption = () => {
  const info = Auth.getitem('userInfo') || {};
  return {
    // 'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    'formid': window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1),
    'clientid': info.clientId,
    "authorization": "Bearer " + info?.token
  }
};