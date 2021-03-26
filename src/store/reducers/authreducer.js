import { 
    CLEAR_LOGIN_ERROR,
    USER_SIGN_OUT,
    POST_DATA,
    POST_DATA_SUCCESS,
    POST_DATA_FAILED,

    GET_DATA,
    GET_DATA_SUCCESS,
    GET_DATA_FAILED,

    DELETE_DATA,
    DELETE_DATA_SUCCESS,
    DELETE_DATA_FAILED,

    UPDATE_DATA,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAILED,

  } from "../actions/types";

import { INITIAL_STATE } from "./states";


export default (state = Object.assign({},{...INITIAL_STATE}) , action) => {
    
  switch (action.type) {
    case POST_DATA:
        return {
        ...state,
        status:false,
        message:"",
        error:{
            flag:false,
            msg:null
        },
        loading:true         
    };
    case POST_DATA_SUCCESS:
        return {
            ...state,
            info:action.payload,
            status:true,
            message:action.message,
            loading:false            
        };
    case POST_DATA_FAILED:return {
        ...state,
        info:null,
        loading:false,
        status:false,
        error:{
            flag:true,
            msg:action.payload
        }  
    };

    case GET_DATA:
        return {
        ...state,
        status:false,
        loading:true,
        message:"",
        error:{
            flag:false,
            msg:null
        },    
    };
    case GET_DATA_SUCCESS:
        return {
            ...state,
            status:true,
            info:action.payload,
            loading:false            
        };
    case GET_DATA_FAILED:return {
        ...state,
        info:null,
        status:false,
        loading:false,
        error:{
            flag:true,
            msg:action.payload
        }  
    };

    case DELETE_DATA:
        return {
        ...state,
        status:false,
        loading:true,
        message:"",
        error:{
            flag:false,
            msg:null
        },     
    };
    case DELETE_DATA_SUCCESS:
        return {
            ...state,
            status:true,
            info:action.payload,
            loading:false            
        };
    case DELETE_DATA_FAILED:return {
        ...state,
        info:null,
        status:false,
        loading:false,
        error:{
            flag:true,
            msg:action.payload
        }  
    };

    case UPDATE_DATA:
        return {
        ...state,
        status:false,
        loading:true,
        message:"",
        error:{
            flag:false,
            msg:null
        },     
    };
    case UPDATE_DATA_SUCCESS:
        return {
            ...state,
            status:true,
            info:action.payload,
            loading:false            
        };
    case UPDATE_DATA_FAILED:return {
        ...state,
        info:null,
        status:false,
        loading:false,
        error:{
            flag:true,
            msg:action.payload
        }  
    };

    case USER_SIGN_OUT:
        return INITIAL_STATE;
    case CLEAR_LOGIN_ERROR:
        return {
            ...state,        
            error:{
                flag:false,
                msg:null
            }            
        };
    default:
        return state;
  }
};