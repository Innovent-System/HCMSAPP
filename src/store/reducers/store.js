
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import logger from 'redux-logger';

import app from "./authreducer";
import common, { enableFilterReducer, commonDropDownIds, filterBarReducer } from "./commonreducer";



const reducers = combineReducers({
  app,
  common,
  enableFilterReducer,
  commonDropDownIds,
  filterBar: filterBarReducer
});

let middleware = [];
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, thunk];
} else {
  middleware = [...middleware, thunk];
}

export const store = createStore(reducers, {}, applyMiddleware(...middleware));
