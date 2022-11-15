import { map } from '#root/utils/axios'
import TokenService from '#root/utils/axios/token.axios'
import { isSuccess } from '#root/utils/func'
import { AUTH } from './_contanst'

export const register = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(AUTH.REGISTER, params)
}

export const login = (params = {}) => {
    return map(({ data, ...rest }) => {
        // return isSuccess(rest) ? { data: data } : { data: [] }
        if (isSuccess(rest)) {
            if (data.accessToken) {
                TokenService.setUser(data)
            }

            return data
        }
    }).post(AUTH.LOGIN, params)
}

export const refreshToken = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(AUTH.REFRESH_TOKEN, params)
}

export const logout = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: {} }
    }).post(AUTH.LOGOUT, params)
}
