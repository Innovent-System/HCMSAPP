import axios from 'axios';
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
    post: builder.query({
      query: ({ url, data }) => ({ url, body: data, method: "POST", headers: headerOption() })
    }),
    entity: builder.query({
      query: ({ url, id }) => ({ url: `${url}/${id}`, headers: headerOption() }),
    }),
    add: builder.mutation({
      query: ({ url, data }) => ({ url, body: data, method: "POST", headers: headerOption() })
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
    single: builder.query({
      query: ({ url, params }) => ({ url, params, headers: headerOption() }),
    }),
  }),
})

export const { useEntitiesQuery, useLazyEntityQuery, useLazyPostQuery, useLazySingleQuery, useAddMutation, useUpdateManyMutation, useRemoveMutation, useUpdateOneMutation } = getApi;

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

export const AuthThunk = createAsyncThunk('auth/requestStatus', async ({ url, params }, { fulfillWithValue, rejectWithValue }) => {
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

export const AppRoutesThunk = createAsyncThunk('approute/requestStatus', async ({ url, params }, { fulfillWithValue, rejectWithValue }) => {
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

export const EmployeeDataThunk = createAsyncThunk('employeedata/requestStatus', async ({ url, params }, { fulfillWithValue, rejectWithValue }) => {
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

const emptyString = "";
const INITIAL_STATE = {
  status: false,
  DropDownData: {},
  employeeData: {},
  routeData: {},
  commands: [],
  authData: {},
  userInfo: {
    email: '',
    clientId: null,
    userName: "",
    companyId: null,
    fkEmployeeId: null,
    userId: null
  },
  dropdownIds: {
    countryIds: '',
    employeeIds: '',
    stateIds: '',
    cityIds: '',
    areaIds: '',
    groupIds: '',
    departmentIds: '',
    designationIds: ''
  },
  isReset: false,
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
      state.dropdownIds = { ...state.dropdownIds, ...action.payload }
    },
    clearDropDownIdsAction(state) {
      state.dropdownIds = {
        countryIds: '',
        employeeIds: '',
        stateIds: '',
        cityIds: '',
        areaIds: '',
        groupIds: '',
        departmentIds: '',
        designationIds: ''
      }
    },
    showDropDownFilterAction(state, action) {
      state.showFilterProps = { ...state.showFilterProps, ...action.payload }
    },
    enableFilterAction(state, action) {
      state.enableFilter = action.payload
    },
    resetAction(state, action) {
      state.isReset = action.payload
    },
    builderQueryAction(state, action) {
      state.query.builder = action.payload
    },
    builderFieldsAction(state, action) {
      state.query.fields = action.payload
    },
    setUserInfo(state, action) {
      state.userInfo = { ...state.userInfo, ...action.payload }
    },
    setCommand(state, action) {
      if (Array.isArray(action.payload))
        state.commands = [...state.commands, ...action.payload]
      else
        state.commands = [...state.commands, action.payload]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(AppRoutesThunk.pending, (state, action) => {
      state.status = true;
    })

    builder.addCase(AppRoutesThunk.fulfilled, (state, action) => {
      state.status = false;
      state.routeData = action.payload.data;
    })
    builder.addCase(AppRoutesThunk.rejected, (state, action) => {
      state.status = false;
    })
    builder.addCase(CommonDropDownThunk.pending, (state, action) => {
      state.status = true;
    })
    builder.addCase(CommonDropDownThunk.fulfilled, (state, action) => {
      state.status = false;
      state.DropDownData = action.payload.data
    })
    builder.addCase(CommonDropDownThunk.rejected, (state, action) => {
      state.status = false;
    })
    builder.addCase(EmployeeDataThunk.pending, (state, action) => {
      state.status = true;
    })
    builder.addCase(EmployeeDataThunk.fulfilled, (state, action) => {
      state.status = false;
      state.employeeData = action.payload.data
    })
    builder.addCase(EmployeeDataThunk.rejected, (state, action) => {
      state.status = false;
    })
    builder.addCase(AuthThunk.pending, (state, action) => {
      state.status = true;
    })
    builder.addCase(AuthThunk.fulfilled, (state, action) => {
      state.status = false;
      state.authData = action.payload.data
    })
    builder.addCase(AuthThunk.rejected, (state, action) => {
      state.status = false;
    })
  }
})

const employeeInit = {
  generalTab: {
    emplyeeRefNo: emptyString,
    punchCode: 0,
    firstName: emptyString,
    lastName: emptyString,
    fName: emptyString,
    isAllowLogin: false,
    timezone: emptyString,
    fkCompanyId: emptyString,

    maritalstatus: emptyString,
    email: emptyString,
    gender: emptyString,
    dateofBirth: emptyString,
    fkReligionId: null,
    fkManagerId: null

  },
  companyTab: {
    scheduleId: null,
    fkAreaId: null,
    fkCityId: null,
    fkCountryId: null,
    fkDepartmentId: null,
    fkDesignationId: null,
    fkEmployeeGroupId: null,
    fkStateId: null,
    joiningDate: new Date().toISOString(),
    confirmationDate: null,
    fkManagerId: null

  },
  contactDetial: {
    address1: emptyString,
    address2: emptyString,
    zipCode: emptyString,
    country: emptyString,
    state: emptyString,
    city: emptyString,
    mobileNo: emptyString,
    workNo: emptyString,
    emergencyNo: emptyString
  },
}

export const empSlice = createSlice({
  name: "employee",
  initialState: structuredClone(employeeInit),
  reducers: {
    /**
     * @param {import('@reduxjs/toolkit').PayloadAction<typeof employeeInit["generalTab"]>} action 
     */
    setGeneralAction(state, action) {

      state.generalTab = Object.assign(state.generalTab, { ...action.payload })
    },
    /**
     * @param {import('@reduxjs/toolkit').PayloadAction<typeof employeeInit["companyTab"]>} action 
     */
    setCompanyAction(state, action) {
      state.companyTab = Object.assign(state.companyTab, { ...action.payload })
      state.companyTab.companyInfo.fkManagerId = state.generalTab.companyInfo?.fkManagerId ?? null
    },

  },
  resetEmployee(state) {
    state = structuredClone(employeeInit);
  }

})

export const { builderQueryAction,
  builderFieldsAction,
  resetAction,
  dropDownIdsAction,
  enableFilterAction,
  showDropDownFilterAction,
  setUserInfo,
  clearDropDownIdsAction, setCommand } = appSlice.actions;

export const { setGeneralAction, setCompanyAction, resetEmployee } = empSlice.actions
