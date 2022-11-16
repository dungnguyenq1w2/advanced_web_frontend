import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { GROUPS } from './_contanst'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).get(GROUPS.GET, params)
}

export const getById = (code, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).get(`${GROUPS.GET}/${code}`, params)
}

export const create = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(GROUPS.CREATE, params)
}
