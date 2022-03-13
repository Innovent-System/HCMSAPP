import { DROP_DOWN_STATE, DROP_DOWN_IDS, FILTERBAR_PROPS } from './states'

import {
    GET_COMMON_DD_FAILED,
    GET_COMMON_DD_SUCCESS,
    GET_COMMON_DD_REQUEST,
    SET_COMMON_DD_IDS,
    CLEAR_COMMON_DD_IDS,
    SET_FILTERBAR
} from '../actions/types'
import { enableFilterProps } from '../../components/useDropDown'
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
                countryIds: emptyString,
                stateIds: emptyString,
                cityIds: emptyString,
                areaIds: emptyString,
                groupIds: emptyString,
                departmentIds: emptyString,
                designationIds: emptyString,
            }
        default:
            return state;
    }
}


export const enableFilterReducer = (state = enableFilterProps, action) => {
    switch (action.type) {
        case "SET_SHOW_FILTER":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const filterBarReducer = (state = FILTERBAR_PROPS, action) => {
    switch (action.type) {
        case SET_FILTERBAR:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

