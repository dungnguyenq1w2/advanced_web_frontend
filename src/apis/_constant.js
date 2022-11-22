//#region AUTH
export const AUTH = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY: '/auth/verify',
    LOGOUT: '/auth/logout',
    GOOGLE_LOGIN: '/auth/google-login',
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
    GET_BY_ID: '/groups',
    CREATE: '/groups',
    UPDATE: '/groups',
}
//#endregion
