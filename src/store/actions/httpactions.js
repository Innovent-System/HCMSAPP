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

  ROUTE_DATA,
  ROUTE_DATA_SUCCESS,
  ROUTE_DATA_FAILED,

  GET_COMMON_DD_FAILED,
  GET_COMMON_DD_SUCCESS,
  GET_COMMON_DD_REQUEST

} from "./types";
import { domain, headerOption } from '../../config/appconfig';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { showFilterProps } from '../../components/useDropDown'

export const getApi = createApi({
  reducerPath: "resource",
  baseQuery: fetchBaseQuery({ baseUrl: domain, credentials: "include" }),
  // global configuration for the api
  keepUnusedDataFor: 30,

  endpoints: (builder) => ({
    entities: builder.query({
      query: ({ url, params }) => ({ url, params, headers: headerOption() }),
    }),
    entity: builder.query({
      query: ({ url, params }) => ({ url, params, headers: headerOption() }),
    }),
    add: builder.mutation({
      query: ({ url, data }) => ({ url, body: data, method: "POST", headers: headerOption() }),
    }),
    updateMany: builder.mutation({
      query: ({ url, data }) => ({ url, body: data, method: "PUT", headers: headerOption() }),
    }),
    updateOne: builder.mutation({
      query: ({ url, data }) => ({ url, body: data, method: "PATCH", headers: headerOption() }),
    }),
    remove: builder.mutation({
      query: ({ url, params }) => ({ url: `${url}/${params}`, method: "DELETE", headers: headerOption() }),
    }),
  }),
})

export const { useEntitiesQuery, useAddMutation, useUpdateManyMutation, useRemoveMutation, useUpdateOneMutation } = getApi;

export const useEntityAction = () => {
  const [addEntity] = useAddMutation();
  const [updateEntity] = useUpdateManyMutation();
  const [updateOneEntity] = useUpdateOneMutation();
  const [removeEntity] = useRemoveMutation();

  return {
    addEntity,
    updateEntity,
    updateOneEntity,
    removeEntity
  }

}

export const AppRoutesThunk = createAsyncThunk('approute/requestStatus', async ({ url, data }, { fulfillWithValue, rejectWithValue }) => {
  try {

    const response = await axios.post(domain.concat(url), data, {
      headers: headerOption(), withCredentials: true
    });
    const { result, message } = response.data;
    return fulfillWithValue({
      data: result,
      isSuccess: true,
      message
    })
  } catch (err) {
    return rejectWithValue({
      msg: (err.response?.data ? err.response.data.message : err.message),
      code: err.response.status
    })
  }
})

export const CommonDropDownThunk = createAsyncThunk('dropdown/requestStatus', async ({ url, params }, { fulfillWithValue, rejectWithValue }) => {
  try {

    const response = await axios.get(domain.concat(url), {
      params: params,
      headers: headerOption(), withCredentials: true
    });
    const { result, message } = response.data;
    return fulfillWithValue({
      data: result,
      isSuccess: true,
      message
    })
  } catch (err) {
    return rejectWithValue({
      msg: (err.response?.data ? err.response.data.message : err.message),
      code: err.response.status
    })
  }
})

const INITIAL_STATE = {
  status: false,
  DropDownData: {},
  routeData: {},
  dropdownIds: {
    countryIds: emptyString,
    stateIds: emptyString,
    cityIds: emptyString,
    areaIds: emptyString,
    groupIds: emptyString,
    departmentIds: emptyString,
    designationIds: emptyString
  },
  showFilterProps,
  enableFilter: false,
  query: {
    fields: {},
    builder: ''
  }
}

export const appSlice = createSlice({
  name: 'appdata',
  initialState: INITIAL_STATE,
  reducers: {
    dropDownIdsAction(state, action) {
      state.dropdownIds = action.payload
    },
    clearDropDownIdsAction(state) {
      state.dropdownIds = {
        countryIds: emptyString,
        stateIds: emptyString,
        cityIds: emptyString,
        areaIds: emptyString,
        groupIds: emptyString,
        departmentIds: emptyString,
        designationIds: emptyString
      }
    },
    showDropDownFilterAction(state, action) {
      state.showFilterProps = { ...state.showFilterProps, ...action.payload }
    },
    enableFilterAction(state, action) {
      state.enableFilter = action.payload
    },
    builderQueryAction(state, action) {
      state.query.builder = action.payload
    },
    builderFieldsAction(state, action) {
      state.query.fields = action.payload
    }
  },
  extraReducers: {
    [AppRoutesThunk.pending.type]: (state, action) => {
      state.status = true;
    },
    [AppRoutesThunk.fulfilled.type]: (state, action) => {
      state.status = false;
      state.routeData = action.payload;
    },
    [AppRoutesThunk.rejected.type]: (state, action) => {
      state.status = false;
    },
    [CommonDropDownThunk.pending.type]: (state, action) => {
      state.status = true;
    },
    [CommonDropDownThunk.fulfilled.type]: (state, action) => {
      state.status = false;
      state.DropDownData = action.payload.data
    },
    [CommonDropDownThunk.rejected.type]: (state, action) => {
      state.status = false;
    }
  }
})

export const { builderQueryAction, builderFieldsAction, dropDownIdsAction, enableFilterAction, showDropDownFilterAction, clearDropDownIdsAction } = appSlice.actions;

export const handlePostActions = (url, data = {}) => dispatch => {

  dispatch({
    type: POST_DATA,
    payload: null
  });

  return axios.post(domain.concat(url), data, {
    headers: headerOption(),
    withCredentials: true,
  })
    .then(response => {
      if (response.status) {
        const { result, message } = response.data;

        dispatch({
          type: POST_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data: result,
          isSuccess: true,
          message
        }
      }
    })
    .catch(function (err) {
      dispatch({
        type: POST_DATA_FAILED,
        payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response.status }
      })
    });

};

export const handleUploadActions = (url, data = {}) => dispatch => {

  dispatch({
    type: UPLOAD_DATA,
    payload: null
  });

  return axios.post(domain.concat(url), data, {
    headers: headerOption(),
    withCredentials: true,
  })
    .then(response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: UPLOAD_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data: result,
          isSuccess: true,
          message
        }

      }
    })
    .catch(function (err) {
      dispatch({
        type: UPLOAD_DATA_FAILED,
        payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response.status }
      })
    });

};

export const handleGetActions = (url, params = {}) => dispatch => {

  dispatch({
    type: GET_DATA,
    payload: null
  });

  return axios.get(domain.concat(url), {
    params: params,
    headers: headerOption(),
    withCredentials: true,
  }).then(response => {
    if (response.status) {
      const { result, message } = response.data;

      dispatch({
        type: GET_DATA_SUCCESS,
        payload: result,
        message
      });

      return {
        data: result,
        isSuccess: true,
        message
      }
    }
  }).catch(function (err) {
    dispatch({
      type: GET_DATA_FAILED,
      payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response.status }
    })
  });

};

export const handlePatchActions = (url, data = {}) => dispatch => {

  dispatch({
    type: POST_DATA,
    payload: null
  });

  return axios.patch(domain.concat(url), data, {
    headers: headerOption(),
    withCredentials: true,
  })
    .then(response => {
      if (response.status) {
        const { result, message } = response.data;

        dispatch({
          type: POST_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data: result,
          isSuccess: true,
          message
        }
      }
    })
    .catch(function (err) {
      dispatch({
        type: POST_DATA_FAILED,
        payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response.status }
      })
    });

};



export const handleUpdateActions = (url, data = {}, params = {}) => dispatch => {

  dispatch({
    type: UPDATE_DATA,
    payload: null
  });

  return axios.put(domain.concat(url), data, {
    headers: headerOption(),
    withCredentials: true,
    params: params,
  })
    .then(response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: UPDATE_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data: result,
          isSuccess: true,
          message
        }
      }
    })
    .catch(function (err) {
      dispatch({
        type: UPDATE_DATA_FAILED,
        payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response?.status || 404 }
      })
    });

};

export const handleDeleteActions = (url, params = {}) => dispatch => {

  dispatch({
    type: DELETE_DATA,
    payload: null
  });

  return axios.delete(domain.concat(url + "/" + params), {
    headers: headerOption(),
    //data:params,
    withCredentials: true,
  })
    .then(response => {
      if (response.status) {
        const { result, message } = response.data;
        dispatch({
          type: DELETE_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data: result,
          isSuccess: true,
          message
        }
      }
    })
    .catch(function (err) {
      dispatch({
        type: DELETE_DATA_FAILED,
        payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response?.status || 404 }
      })
    });

};

export const handleGetCommonDropDown = (url, params = {}) => dispatch => {

  dispatch({
    type: GET_COMMON_DD_REQUEST,
    payload: null
  });

  return axios.get(domain.concat(url), {
    headers: headerOption(),
    params: params,
    withCredentials: true,
  }).then(response => {
    if (response.status) {
      const { result, message } = response.data;

      dispatch({
        type: GET_COMMON_DD_SUCCESS,
        payload: result,
        message
      });

      return {
        data: result,
        isSuccess: true,
        message
      }
    }
  }).catch(function (err) {
    dispatch({
      type: GET_COMMON_DD_FAILED,
      payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response?.status || 404 }
    })
  });

};

export const handleAppRoutes = (url, data = {}) => dispatch => {

  dispatch({
    type: ROUTE_DATA,
    payload: null
  });

  return axios.post(domain.concat(url), data, {
    headers: headerOption(),
    withCredentials: true,
  })
    .then(response => {
      if (response.status) {
        const { result, message } = response.data;

        dispatch({
          type: ROUTE_DATA_SUCCESS,
          payload: result,
          message
        });

        return {
          data: result,
          isSuccess: true,
          message
        }
      }
    })
    .catch(function (err) {
      dispatch({
        type: ROUTE_DATA_FAILED,
        payload: { msg: (err.response?.data ? err.response.data.message : err.message), code: err.response?.status || 404 }
      })
    });

};

export const clearLoginError = () => dispatch => {
  dispatch({
    type: CLEAR_LOGIN_ERROR,
    payload: null
  });
};