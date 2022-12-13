import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { PRESENTATIONS } from './_constant'

export const getAllByHostId = (hostId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(PRESENTATIONS.GET_ALL_BY_HOST_ID(hostId), params)
}

export const getAllSlidesById = (presentationId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(PRESENTATIONS.GET_ALL_SLIDES_BY_ID(presentationId), params)
}

export const deletePresentation = (presentationId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).remove(PRESENTATIONS.DELETE_PRESENTATION(presentationId), params)
}

export const postCheckCodePresentation = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { error: rest.response.data }
    }).post(PRESENTATIONS.POST_CHECK_CODE, params)
}

export const postAddPresentation = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).post(PRESENTATIONS.POST_ADD, params)
}