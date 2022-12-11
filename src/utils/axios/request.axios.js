import { logout, refreshToken } from 'apis/auth.api'

import instance from './index'
import TokenService from './token.axios'

// fetch: method = get
export async function get(url, options = {}) {
    try {
        return await instance.get(url, {
            params: { ...options },
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
        })
    } catch (err) {
        return err
    }
}

// fetch: method = delete
export async function remove(url, options = {}) {
    try {
        return await instance.delete(url, { data: { ...options } })
    } catch (err) {
        return err
    }
}

// fetch: refresh Token
export async function refresh() {
    try {
        return await refreshToken({
            refreshToken: TokenService.getLocalRefreshToken(),
        })
    } catch (err) {
        return err
    }
}

export async function tryLogout() {
    try {
        return await logout({
            refreshToken: TokenService.getLocalRefreshToken(),
        })
    } catch (err) {
        return err
    }
}
