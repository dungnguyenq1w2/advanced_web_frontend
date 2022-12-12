import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { CHOICES } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(CHOICES.GET_ALL, params)
}

export const getById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).get(CHOICES.GET_BY_ID(id), params)
}
