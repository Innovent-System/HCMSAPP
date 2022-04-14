
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import logger from 'redux-logger';

import app from "./authreducer";
import common, { showFilterReducer,enableFilterReducer, commonDropDownIds, queryBuilderReducer } from "./commonreducer";



const reducers = combineReducers({
  app,
  common,
  showFilterReducer,
  enableFilter:enableFilterReducer,
  commonDropDownIds,
  query: queryBuilderReducer
});

let middleware = [];
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, thunk];
} else {
  middleware = [...middleware, thunk];
}

export const store = createStore(reducers, {}, applyMiddleware(...middleware));
