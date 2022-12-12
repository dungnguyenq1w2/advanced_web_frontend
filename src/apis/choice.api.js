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

export const add = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(CHOICES.ADD, params)
}

export const update = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).put(CHOICES.UPDATE(id), params)
}

export const remove = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).remove(CHOICES.REMOVE(id), params)
}
