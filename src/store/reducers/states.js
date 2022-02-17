export const INITIAL_STATE = {
    info:null,
    loading: false,
    status:false,
    message:emptyString,
    error:{
        flag:false,
        msg: null,
        code:null,
        result:null
    },
    DropDown:{
        Countries:[],
        States:[],
        Cities:[]
    },
    routeData:[]
}
