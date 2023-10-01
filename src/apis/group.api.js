import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { GROUPS } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(GROUPS.GET_ALL, params)
}

export const getById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).get(GROUPS.GET_BY_ID(id), params)
}

export const create = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(GROUPS.CREATE, params)
}

export const promoteParticipant = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).put(GROUPS.PROMOTE(id), params)
}

export const demoteParticipant = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).put(GROUPS.DEMOTE(id), params)
}

export const kickOutParticipant = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).remove(GROUPS.KICK_OUT(id), params)
}

export const setOwner = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).put(GROUPS.SET_OWNER(id), params)
}

export const generateInviteCode = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.code } : { data: [] }
    }).post(GROUPS.GENERATE_INVITE_CODE(id), params)
}

export const joinGroupByLink = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { error: rest.response.data }
    }).post(GROUPS.INVITE(id), params)
}

export const joinGroupByEmail = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { error: rest.response.data }
    }).post(GROUPS.INVITE_MAIL(id), params)
}

export const sendInvitationByEmail = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(GROUPS.SEND_INVITAION_MAIL(id), params)
}

export const deleteGroup = (groupId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).remove(GROUPS.DELETE_GROUP_BY_ID(groupId), params)
}