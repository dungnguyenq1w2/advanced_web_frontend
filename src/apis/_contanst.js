//#region AUTH
export const AUTH = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
}
//#endregion

//#region USERS
export const USERS = {
    GET: '/users',
    GET_BY_ID: '/users/:id',
}
//#endregion

//#region USERS
export const GROUPS = {
    GET: '/groups',
    GET_BY_ID: '/groups/:id',
    CREATE: '/groups',
    UPDATE: '/groups/:id',
}
//#endregion
