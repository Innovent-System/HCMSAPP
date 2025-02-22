import axios from 'axios';
import { domain, headerOption } from '../../config/appconfig';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { showFilterProps } from '../../components/useDropDown'
import { getDefaultMonth } from '../../util/common';

export const getApi = createApi({
  reducerPath: "resource",
  baseQuery: fetchBaseQuery({ baseUrl: domain, credentials: "include" }),
  // global configuration for the api
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    entities: builder.query({
      query: ({ url, data }) => ({ url, body: data, method: "POST", headers: headerOption() }),
      transformResponse: (response) => response?.result

    }),
    post: builder.query({
      query: ({ url, data }) => ({ url, body: data, method: "POST", headers: headerOption() }),
      transformResponse: (response) => response?.result
    }),
    file: builder.query({
      query: ({ url, data, fileName = "report.pdf" }) => ({
        url, body: data, method: "POST", headers: headerOption(),
        responseHandler: async (response) => {

          if (response.url.endsWith("download") && response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName // replace with desired file name
            a.click()
          } else
            return await response.json();
        },

      }),
    }),
    entityById: builder.query({
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

export const { useEntitiesQuery, useEntityByIdQuery, useLazyFileQuery, useLazyEntityByIdQuery, usePostQuery, useLazyPostQuery, useSingleQuery, useLazySingleQuery, useAddMutation, useUpdateManyMutation, useRemoveMutation, useUpdateOneMutation } = getApi;

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
      headers: headerOption()
    });
    const { result, message } = response.data;
    return fulfillWithValue({
      data: result,
      isSuccess: true,
      message
    })
  } catch (err) {
    console.log(err)
    const { response } = err;
    return rejectWithValue({
      msg: (response?.data?.message ? response.data?.message : response.statusText),
      code: response.status
    })
  }
})

export const AppRoutesThunk = createAsyncThunk('approute/requestStatus', async ({ url, params }, { fulfillWithValue, rejectWithValue }) => {
  try {

    const response = await axios.get(domain.concat(url), {
      params: params,
      headers: headerOption()
    });
    const { result, message } = response.data;
    return fulfillWithValue({
      data: result,
      isSuccess: true,
      message
    })
  } catch (err) {
    const { response } = err;
    return rejectWithValue({
      msg: (response.data?.message ? response.data?.message : response.message),
      code: response.status
    })
  }
})

export const CommonDropDownThunk = createAsyncThunk('dropdown/requestStatus', async ({ url, params }, { fulfillWithValue, rejectWithValue }) => {
  try {

    const response = await axios.get(domain.concat(url), {
      params: params,
      headers: headerOption()
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
      headers: headerOption()
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

export const PayrollDataThunk = createAsyncThunk('payrolldata/requestStatus', async ({ url, params }, { fulfillWithValue, rejectWithValue }) => {
  try {

    const response = await axios.get(domain.concat(url), {
      params: params,
      headers: headerOption()
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
  isLoading: false,
  DropDownData: {
    Countries: [],
    States: [],
    Cities: [],
    Companies: [],
    Areas: [],
    Departments: []
  },
  employeeData: {
    Employees: [],
    Designations: [], Groups: [], RoleTemplates: [], Schedules: [], AttendanceFlag: [], Religion: [],
    EmployeeStatus: [], LeaveAccural: []
  },
  payrollData: {
    AllowancesTitle: [],
    DeductionsTitle: [],
    PayrollSetups: []
  },
  routeData: {
    sideMenuData: [],
    appRoutes: [],
    appReports: []

  },
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
    companyIds: '',
    countryIds: '',
    employeeIds: '',
    stateIds: '',
    cityIds: '',
    areaIds: '',
    groupIds: '',
    departmentIds: '',
    designationIds: '',
    yearIds: new Date().getFullYear(),
    monthIds: getDefaultMonth()
  },
  isReset: false,
  fileConfig: {
    upload: null,
    template: null
  },
  showFilterProps,
  enableFilter: false,
  query: {
    fields: {},
    builder: '',
    filters: {}
  },
  pageHeaderOption: {
    apply: null
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
        companyIds: '',
        countryIds: '',
        employeeIds: '',
        stateIds: '',
        cityIds: '',
        areaIds: '',
        groupIds: '',
        departmentIds: '',
        designationIds: '',
        yearIds: new Date().getFullYear(),
        monthIds: getDefaultMonth()
      }
    },
    showDropDownFilterAction(state, action) {
      state.showFilterProps = {
        company: false,
        country: false,
        state: false,
        city: false,
        area: false,
        department: false,
        group: false,
        designation: false,
        employee: false,
        ...action.payload
      }
    },
    enableFilterAction(state, action) {
      state.enableFilter = action.payload
    },
    resetAction(state, action) {
      state.isReset = action.payload
    },
    setGlobalLoader(state, action) {
      state.isLoading = action.payload;
    },
    /**
     * 
     * @param {typeof INITIAL_STATE} state 
     * @param {Object} action 
     * @param {{upload:Function,template:Function}} action.payload 
     */
    setFileConfig(state, action) {
      state.fileConfig = action.payload

    },
    setPageHeaderOption(state, action) {
      state.pageHeaderOption = action.payload
    },
    builderQueryAction(state, action) {
      state.query.builder = action.payload
    },
    builderFieldsAction(state, action) {
      state.query.fields = action.payload
    },
    builderFilterAction(state, action) {
      state.query.filters = action.payload
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
    //
    builder.addCase(PayrollDataThunk.pending, (state, action) => {
      state.status = true;
    })
    builder.addCase(PayrollDataThunk.fulfilled, (state, action) => {
      state.status = false;
      state.payrollData = action.payload.data
    })
    builder.addCase(PayrollDataThunk.rejected, (state, action) => {
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
  builderFilterAction,
  resetAction,
  dropDownIdsAction,
  enableFilterAction,
  showDropDownFilterAction,
  setUserInfo,
  clearDropDownIdsAction, setCommand, setFileConfig, setPageHeaderOption, setGlobalLoader } = appSlice.actions;

export const { setGeneralAction, setCompanyAction, resetEmployee } = empSlice.actions
