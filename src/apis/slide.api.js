import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { SLIDES } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(SLIDES.GET_ALL, params)
}

export const getFirst = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(SLIDES.GET_FIRST, params)
}

export const getLast = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(SLIDES.GET_LAST, params)
}

export const getById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).get(SLIDES.GET_BY_ID(id), params)
}

export const getForHostById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).get(SLIDES.GET_FOR_HOST_BY_ID(id), params)
}

export const getForMemberById = (id, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).get(SLIDES.GET_FOR_MEMBER_BY_ID(id), params)
}

export const add = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(SLIDES.ADD, params)
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
