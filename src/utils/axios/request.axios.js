import { logout, refreshToken } from '#root/apis/auth.api'
// import { AUTH } from "src/apis/_constant";

// import { store } from "src/store";

// import { tryLogout } from "_common/actions/auth.action";

import instance from './index'
import TokenService from './token.axios'

// const CancelToken = axios.CancelToken

// let _source = CancelToken.source()

// function getRefetchToken() {
// 	return window.localStorage.getItem(process.env.REACT_APP_STORE_REFRESH_TOKEN);
// }

// cancel token
// export function cancel(message = null) {
//     _source.cancel(message)

//     setTimeout(() => (_source = CancelToken.source()), 50)
// }

// fetch: method = get
export async function get(url, options = {}) {
    try {
        return await instance.get(url, {
            ...options,
            // cancelToken: _source.token,
        })
    } catch (err) {
        return err
    }
}

// fetch: method = post
export async function post(url, body, options = {}) {
    try {
        return await instance.post(url, body, {
            ...options,
            // cancelToken: _source.token,
        })
    } catch (err) {
        return err
    }
}

// fetch: method = put
export async function put(url, body, options = {}) {
    try {
        return await instance.put(url, body, {
            ...options,
            // cancelToken: _source.token,
        })
    } catch (err) {
        return err
    }
}

// fetch: method = delete
export async function remove(url, options = {}) {
    try {
        return await instance.delete(url, {
            ...options,
            // cancelToken: _source.token,
        })
    } catch (err) {
        return err
    }
}

// // fetch: refresh Token
export async function refresh() {
    try {
        return await refreshToken({
            refreshToken: TokenService.getLocalRefreshToken(),
        })
    } catch (err) {
        return err
    }
}

// fetch: refresh Token
export async function tryLogout() {
    try {
        return await logout({
            refreshToken: TokenService.getLocalRefreshToken(),
        })
    } catch (err) {
        return err
    }
}
