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
  UPLOAD_DATA_FAILED

} from "./types";

const domain = 'http://localhost:5000/api/';

const headerOption = {
  token: document.cookie || '',
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const handlePostActions = (url, data = {}) => dispatch => {

  dispatch({
    type: POST_DATA,
    payload: null
  });

  axios.post(domain.concat(url), data, {
    headers:headerOption
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: POST_DATA_SUCCESS,
          payload: result,
          message
        });
      }
    })
    .catch(function (err) {
      dispatch({
        type: POST_DATA_FAILED,
        payload: err.response?.data ? err.response.data.message : err.message
      })
    });
  
};


export const handleUploadActions = (url, data = {}) => dispatch => {

  dispatch({
    type: UPLOAD_DATA,
    payload: null
  });

  axios.post(domain.concat(url), data, {
    headers:headerOption
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: UPLOAD_DATA_SUCCESS,
          payload: result,
          message
        });
      }
    })
    .catch(function (err) {
      dispatch({
        type: UPLOAD_DATA_FAILED,
        payload: err.response?.data ? err.response.data.message : err.message
      })
    });
  
};

export const handleGetActions = (url, params = {}) => dispatch => {

  dispatch({
    type: GET_DATA,
    payload: null
  });

  axios.get(domain.concat(url), {
    params:params,
    headers:headerOption
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: GET_DATA_SUCCESS,
          payload: result,
          message
        });
      }
    })
    .catch(function (err) {
      dispatch({
        type: GET_DATA_FAILED,
        payload: err.response?.data ? err.response.data.message : err.message
      })
    });
  
};

export const handleUpdateActions = (url, data ={}, params = {}) => dispatch => {

  dispatch({
    type: UPDATE_DATA,
    payload: null
  });
  
  axios.put(domain.concat(url), data,{
    params:params,
    headers:headerOption
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: UPDATE_DATA_SUCCESS,
          payload: result,
          message
        });
      }
    })
    .catch(function (err) {
      dispatch({
        type: UPDATE_DATA_FAILED,
        payload: err.response?.data ? err.response.data.message : err.message
      })
    });
  
};


export const handleDeleteActions = (url, params = {}) => dispatch => {

  dispatch({
    type: DELETE_DATA,
    payload: null
  });
 
  axios.delete(domain.concat(url),{
    params:params,
    headers:headerOption
  })
    .then( response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: DELETE_DATA_SUCCESS,
          payload: result,
          message
        });
      }
    })
    .catch(function (err) {
      dispatch({
        type: DELETE_DATA_FAILED,
        payload: err.response?.data ? err.response.data.message : err.message
      })
    });
  
};


export const clearLoginError = () => dispatch => {
  dispatch({
    type: CLEAR_LOGIN_ERROR,
    payload: null
  });
};