
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import logger from 'redux-logger';

import auth from "./authreducer";



const reducers = combineReducers({
  auth,
});

let middleware = [];
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, thunk];
} else {
  middleware = [...middleware, thunk];
}

export const store = createStore(reducers, {}, applyMiddleware(...middleware));
