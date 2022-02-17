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
    SET_COMMON_DROPDOWN,
    ROUTE_DATA_FAILED,
    ROUTE_DATA_SUCCESS,
    ROUTE_DATA

  } from "../actions/types";

import { INITIAL_STATE } from "./states";


export default (state = INITIAL_STATE , action) => {
    
  switch (action.type) {
case SET_COMMON_DROPDOWN:
    return{
        ...state,
        ...action.payload
    };
    case POST_DATA:
        return {
        ...state,
        status:false,
        message:emptyString,
        error:{
            flag:false,
            msg:null,
            code:null,
            result:null
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
            msg:action.payload.msg,
            code:action.payload.code,
            result:action.payload.result
        }  
    };
    case ROUTE_DATA:
        return {
        ...state,
        status:false,
        message:emptyString,
        error:{
            flag:false,
            msg:null,
            code:null,
            result:null
        },
        loading:true         
    };
    case ROUTE_DATA_SUCCESS:
        return {
            ...state,
            routeData:action.payload,
            status:true,
            message:action.message,
            loading:false            
        };
    case ROUTE_DATA_FAILED:return {
        ...state,
        info:null,
        routeData:[],
        loading:false,
        status:false,
        error:{
            flag:true,
            msg:action.payload.msg,
            code:action.payload.code,
            result:action.payload.result
        }  
    };
    case GET_DATA:
        return {
        ...state,
        status:false,
        loading:true,
        info:null,
        message:emptyString,
        error:{
            flag:false,
            msg:null
        },    
    };
    case GET_DATA_SUCCESS:
        return {
            ...state,
            status:true,
            message:action.message,
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
            msg:action.payload.msg,
            code:action.payload.code,
            result:action.payload.result
        }  
    };

    case DELETE_DATA:
        return {
        ...state,
        status:false,
        loading:true,
        message:emptyString,
        error:{
            flag:false,
            msg:null,
            code:null,
            result:null
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
            msg:action.payload.msg,
            code:action.payload.code
        }  
    };

    case UPDATE_DATA:
        return {
        ...state,
        status:false,
        loading:true,
        message:emptyString,
        error:{
            flag:false,
            msg:null,
            code:null,
            result:null
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
            msg:action.payload.msg,
            code:action.payload.code,
            result:action.payload.result
        }
    };

    case USER_SIGN_OUT:
        return INITIAL_STATE;
    case CLEAR_LOGIN_ERROR:
        return {
            ...state,        
            error:{
                flag:false,
                msg:null,
                code:null,
                result:null
            }            
        };
    default:
        return state;
  }
};