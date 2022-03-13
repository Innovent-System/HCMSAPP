export const INITIAL_STATE = {
    info: null,
    loading: false,
    status: false,
    message: emptyString,
    error: {
        flag: false,
        msg: null,
        code: null,
        result: null
    },
    routeData: []
}


export const DROP_DOWN_STATE = {
    DropDownData: {
        Countries: [],
        States: [],
        Cities: []
    }
}

export const FILTERBAR_PROPS = {
    isApply: false,
    isReset: false
}

export const DROP_DOWN_IDS = {
    countryIds: emptyString,
    stateIds: emptyString,
    cityIds: emptyString,
    areaIds: emptyString,
    groupIds: emptyString,
    departmentIds: emptyString,
    designationIds: emptyString,
}