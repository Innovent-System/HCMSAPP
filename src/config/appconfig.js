import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();


export const domain = 'http://localhost:5000/api/';


export const headerOption = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=UTF-8',
  'formid': window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1),
  'clientid':1
});

