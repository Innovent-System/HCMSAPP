import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();


export const domain = 'http://localhost:5000/api/';

export const headerOption = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=UTF-8',
  'formId': window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]
});

