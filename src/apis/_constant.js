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
    PROMOTE: (id) => `/groups/${id}/promote`,
    DEMOTE: (id) => `/groups/${id}/demote`,
    KICK_OUT: (id) => `/groups/${id}/kick-out`,
    INVITE: (id) => `/groups/${id}/invite`,
    INVITE_MAIL: (id) => `/groups/${id}/invite-email`,
    SEND_INVITAION_MAIL: (id) => `/groups/${id}/send-email`,
}
//#endregion
