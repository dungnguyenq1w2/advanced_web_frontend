import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { NOTIFICATIONS } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: [] }
    }).get(NOTIFICATIONS.GET_ALL, params)
}

export const add = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(NOTIFICATIONS.ADD, params)
}

export const readNotifications = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).put(NOTIFICATIONS.PUT, params)
}
