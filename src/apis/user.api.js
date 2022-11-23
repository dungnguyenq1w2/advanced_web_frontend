import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { USERS } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).get(USERS.GET, params)
}

export const getById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).get(`${USERS.GET_BY_ID}/${id}`, params)
}


export const updateProfile = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).put(`${USERS.PUT}/${id}`, params)
}
