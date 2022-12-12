import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { SLIDES } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(SLIDES.GET_ALL, params)
}

export const getById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).get(SLIDES.GET_BY_ID(id), params)
}

export const update = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).put(SLIDES.UPDATE(id), params)
}

export const remove = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).remove(SLIDES.REMOVE(id), params)
}

export const getForHost = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).get(SLIDES.GET_FOR_HOST(id), params)
}

export const getForGuest = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).get(SLIDES.GET_FOR_GUEST(id), params)
}
