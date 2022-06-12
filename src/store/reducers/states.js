export const INITIAL_STATE = {
    info: null,
    loading: false,
    status: false,
    message: '',
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

export const Query_PROPS = {
    fields: {},
    builder: {}
}

export const DROP_DOWN_IDS = {
    countryIds: '',
    stateIds: '',
    cityIds: '',
    areaIds: '',
    groupIds: '',
    departmentIds: '',
    designationIds: '',
}