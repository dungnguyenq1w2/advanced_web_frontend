import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { SLIDES } from './_constant'

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
