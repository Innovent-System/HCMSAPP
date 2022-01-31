import axios from 'axios';
import {
  CLEAR_LOGIN_ERROR,

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

  UPLOAD_DATA,
  UPLOAD_DATA_SUCCESS,
  UPLOAD_DATA_FAILED,

  GET_COMMON_DD_FAILED,
  GET_COMMON_DD_SUCCESS,
  GET_COMMON_DD_REQUEST

} from "./types";
import {domain,headerOption} from '../../config/appconfig';


export const handlePostActions = (url, data = {}) => dispatch  => {

  dispatch({
    type: POST_DATA,
    payload: null
  });

  return axios.post(domain.concat(url), data, {
    headers:headerOption(),
    withCredentials:true,
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        
        dispatch({
          type: POST_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data:result,
          isSuccess:true,
          message
         }
      }
    })
    .catch(function (err) {
      dispatch({
        type: POST_DATA_FAILED,
        payload:{msg:(err.response?.data ? err.response.data.message : err.message),code:err.response.status} 
      })
    });
  
};


export const handleUploadActions = (url, data = {}) => dispatch => {

  dispatch({
    type: UPLOAD_DATA,
    payload: null
  });

  return axios.post(domain.concat(url), data, {
    headers:headerOption(),
    withCredentials:true,
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: UPLOAD_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data:result,
          isSuccess:true,
          message
         }
        
      }
    })
    .catch(function (err) {
      dispatch({
        type: UPLOAD_DATA_FAILED,
        payload:{msg:(err.response?.data ? err.response.data.message : err.message),code:err.response.status} 
      })
    });
  
};

export const handleGetActions = (url, params = {}) => dispatch => {

  dispatch({
    type: GET_DATA,
    payload: null
  });

 return axios.get(domain.concat(url), {
    params:params,
    headers:headerOption(),
    withCredentials:true,
  }).then( response => {
      if (response.status) {
        const { result, message } = response.data;
        
        dispatch({
          type: GET_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
         data:result,
         isSuccess:true,
         message
        }
      }
    }).catch(function (err) {
      dispatch({
        type: GET_DATA_FAILED,
        payload:{msg:(err.response?.data ? err.response.data.message : err.message),code:err.response.status} 
      })
    });
  
};

export const handleGetCommonDropDown = (url, params = {}) => dispatch => {

  dispatch({
    type: GET_COMMON_DD_REQUEST,
    payload: null
  });

 return axios.get(domain.concat(url), {
    params:params,
    headers:headerOption(),
    withCredentials:true,
  }).then( response => {
      if (response.status) {
        const { result, message } = response.data;
        
        dispatch({
          type: GET_COMMON_DD_SUCCESS,
          payload: result,
          message
        });

        return {
         data:result,
         isSuccess:true,
         message
        }
      }
    }).catch(function (err) {
      dispatch({
        type: GET_COMMON_DD_FAILED,
        payload:{msg:(err.response?.data ? err.response.data.message : err.message),code:err.response.status} 
      })
    });
  
};

export const handleUpdateActions = (url, data ={}, params = {}) => dispatch => {

  dispatch({
    type: UPDATE_DATA,
    payload: null
  });
  
  return axios.put(domain.concat(url), data,{
    params:params,
    headers:headerOption(),
    withCredentials:true,
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: UPDATE_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data:result,
          isSuccess:true,
          message
         }
      }
    })
    .catch(function (err) {
      dispatch({
        type: UPDATE_DATA_FAILED,
        payload:{msg:(err.response?.data ? err.response.data.message : err.message),code:err.response.status} 
      })
    });
  
};


export const handleDeleteActions = (url, params = {}) => dispatch => {

  dispatch({
    type: DELETE_DATA,
    payload: null
  });
 
  return axios.delete(domain.concat(url),{
    params:params,
    headers:headerOption(),
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: DELETE_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data:result,
          isSuccess:true,
          message
         }
      }
    })
    .catch(function (err) {
      dispatch({
        type: DELETE_DATA_FAILED,
        payload:{msg:(err.response?.data ? err.response.data.message : err.message),code:err.response.status} 
      })
    });
  
};


export const clearLoginError = () => dispatch => {
  dispatch({
    type: CLEAR_LOGIN_ERROR,
    payload: null
  });
};