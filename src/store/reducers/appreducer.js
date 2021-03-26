import { FETCH_ROUTES,FETCH_ROUTES_SUCCESS,FETCH_ROUTES_FAILED } from '../actions/types';

import { INITIAL_STATE } from "./states";

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_ROUTES:
          return {
              ...state,
              loading:true         
          };
      case FETCH_ROUTES_SUCCESS:
          return {
              ...state,
              info:action.payload,
              loading:false            
          };
      case FETCH_ROUTES_FAILED:
          return {
              ...state,
              loading:false,
              info:null,
              error:{
                flag:true,
                msg:action.payload
            }  
          };
      default:
          return state;
    }
  };