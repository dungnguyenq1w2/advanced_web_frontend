import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { MESSAGES } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: [] }
    }).get(MESSAGES.GET_ALL, params)
}

export const add = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(MESSAGES.ADD, params)
}
