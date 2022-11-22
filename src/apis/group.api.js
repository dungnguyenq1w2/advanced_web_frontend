import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { GROUPS } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(GROUPS.GET, params)
}

export const getById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        console.log('dataaaa:', data)
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).get(`${GROUPS.GET}/${id}`, params)
}

export const create = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(GROUPS.CREATE, params)
}

export const promoteParticipant = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).put(`${GROUPS.UPDATE}/${id}/promote`, params)
}

export const demoteParticipant = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).put(`${GROUPS.UPDATE}/${id}/demote`, params)
}

export const kickOutParticipant = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).remove(`${GROUPS.UPDATE}/${id}/kick-out`, params)
}
