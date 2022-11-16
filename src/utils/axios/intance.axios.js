import axios from 'axios'
import { CORS, FORM_HEADER_JSON } from './header.axios'
import { refresh, tryLogout } from './request.axios'
import TokenService from './token.axios'

const _instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { ...FORM_HEADER_JSON, ...CORS },
    // timeout: _timeout,
})

let isRefetching = false // Flag of first request

const _queue = [] // Save next requests to use later when refetching done

const handleRefetch = async (originalConfig) => {
    // Next request will wait until refetching done
    if (!isRefetching) {
        isRefetching = true

        return refresh()
            .then(({ data }) => {
                isRefetching = false

                const { accessToken } = data
                TokenService.updateLocalAccessToken(accessToken)

                _queue.forEach(({ resolve }) => resolve()) // Call next requests

                return _instance(originalConfig)
            })
            .catch((error) => {
                _queue.forEach(({ reject }) => reject(error))

                return Promise.reject(error)
            })
    } else {
        // Save to use later when refetching done
        return new Promise((resolve, reject) => _queue.push({ resolve, reject }))
            .then(() => null)
            .catch((error) => Promise.reject(error))
    }
}

const handleLogout = async (originalConfig) => {
    // Logout
    return tryLogout()
        .then(({ data }) => {
            TokenService.removeUser()
            return _instance(originalConfig)
        })
        .catch((error) => {
            return Promise.reject(error)
        })
}

_instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken()
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token // for Spring Boot back-end
            // config.headers['x-access-token'] = token // for Node.js Express back-end
        } else {
            delete config.headers['Authorization']
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

_instance.interceptors.response.use(
    (res) => {
        return res
    },
    async (err) => {
        const originalConfig = err.config
        // All api except Auth api
        if (originalConfig.url !== '/auth/login' && err.response) {
            // Access Token was expired
            if (err.response.status === 403 && !originalConfig._retry) {
                originalConfig._retry = true
                return handleRefetch(originalConfig)
            }
            // Refresh Token was expired
            if (err.response.status === 401 && originalConfig._retry) {
                originalConfig._retry = false
                return handleLogout(originalConfig)
            }
        }
        return Promise.reject(err)
    }
)

export default _instance
