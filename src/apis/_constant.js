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
    GET_BY_ID: '/users',
    PUT: '/users',
}
//#endregion

//#region GROUPS
export const GROUPS = {
    GET: '/groups',
    GET_BY_ID: '/groups',
    CREATE: '/groups',
    PROMOTE: (id) => `/groups/${id}/promote`,
    DEMOTE: (id) => `/groups/${id}/demote`,
    KICK_OUT: (id) => `/groups/${id}/kick-out`,
    SET_OWNER: (id) => `/groups/${id}/set-owner`,
    INVITE: (id) => `/groups/${id}/invite`,
    INVITE_MAIL: (id) => `/groups/${id}/invite-email`,
    SEND_INVITAION_MAIL: (id) => `/groups/${id}/send-email`,
    GENERATE_INVITE_CODE: (id) => `/groups/${id}/generate-invite-code`,
}
//#endregion

//#region PRESENTATIONS
export const PRESENTATIONS = {
    GET_ALL_BY_HOST_ID: (hostId) => `/presentations/${hostId}`,
    GET_ALL_SLIDES_BY_ID: (presentationId) => `/presentations/${presentationId}/slides`,
}

//#region SLIDES
export const SLIDES = {
    GET_FOR_HOST: (id) => `/slides/${id}/host`,
    GET_FOR_GUEST: (id) => `/slides/${id}/guest`,
}
//#endregion
