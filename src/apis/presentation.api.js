import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { PRESENTATIONS } from './_constant'

export const getAllByHostId = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(PRESENTATIONS.GET_ALL_BY_HOST_ID, params)
}

export const getAllByGroupId = (groupId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(PRESENTATIONS.GET_ALL_BY_GROUP_ID(groupId), params)
}

export const getPresentationById = (presentationId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(PRESENTATIONS.GET_PRESENTATION_BY_ID(presentationId), params)
}

export const getForHostById = (presentationId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).get(PRESENTATIONS.GET_PRESENTATION_FOR_HOST_ID(presentationId), params)
}

export const getForMemberById = (presentationId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).get(PRESENTATIONS.GET_PRESENTATION_FOR_MEMBER_ID(presentationId), params)
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

export const updatePresentationName = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).put(PRESENTATIONS.UPDATE_PRESENTATION_NAME, params)
}

export const postCreatePresentationCode = (presentationId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: {} }
    }).post(PRESENTATIONS.POST_NEW_CODE(presentationId), params)
}

export const addToGroup = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(PRESENTATIONS.ADD_TO_GROUP, params)
}

export const removeFromGroup = (presentationGroupId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).remove(PRESENTATIONS.REMOVE_FROM_GROUP(presentationGroupId), params)
}
