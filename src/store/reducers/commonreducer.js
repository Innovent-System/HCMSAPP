import { DROP_DOWN_STATE, DROP_DOWN_IDS, Query_PROPS } from './states'

import {
    GET_COMMON_DD_FAILED,
    GET_COMMON_DD_SUCCESS,
    GET_COMMON_DD_REQUEST,
    SET_COMMON_DD_IDS,
    CLEAR_COMMON_DD_IDS,
    SET_QUERY_FIELDS,
    SET_QUERY,
    RESET_QUERY,SET_SHOW_FILTER,ENABLE_FILTERS
} from '../actions/types'
import { showFilterProps } from '../../components/useDropDown'
/**
 * @param {Object} action 
 * @param {Object} state
 */




export default (state = DROP_DOWN_STATE, action) => {
    switch (action.type) {
        case GET_COMMON_DD_REQUEST:
            return {
                DropDownData: {}
            }
        case GET_COMMON_DD_SUCCESS:
            return {
                DropDownData: action.payload.RegularDropDown,
            }
        case GET_COMMON_DD_FAILED: return {
            DropDownData: {},
        };
        default:
            return state;
    }
}

export const commonDropDownIds = (state = DROP_DOWN_IDS, action) => {
    switch (action.type) {
        case SET_COMMON_DD_IDS:
            return {
                ...state,
                ...action.payload
            }
        case CLEAR_COMMON_DD_IDS:
            return {
                countryIds: '',
                stateIds: '',
                cityIds: '',
                areaIds: '',
                groupIds: '',
                departmentIds: '',
                designationIds: '',
            }
        default:
            return state;
    }
}


export const showFilterReducer = (state = showFilterProps, action) => {
    switch (action.type) {
        case SET_SHOW_FILTER:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const enableFilterReducer = (state = false, action) => {
    switch (action.type) {
        case ENABLE_FILTERS:
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export const queryBuilderReducer = (state = Query_PROPS, action) => {
    switch (action.type) {
        case SET_QUERY:
            return {
                ...state,
                ...action.payload
            }
        case SET_QUERY_FIELDS:
            return {
                ...state,
                ...action.payload
            }
        case RESET_QUERY:
            return {
                fields: {},
                builder: {}
            }
        default:
            return state;
    }
}

