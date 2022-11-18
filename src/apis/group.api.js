import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { GROUPS } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).get(GROUPS.GET, params)
}

export const getById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).get(`${GROUPS.GET}/${id}`, params)
}

export const create = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(GROUPS.CREATE, params)
}
