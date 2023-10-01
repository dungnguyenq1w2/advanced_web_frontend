import { get, post, put, remove } from './request.axios'

export const map = (cb = (data) => data, _default = null) => ({
    get: async (url, params) => cb((await get(url, params)) || _default),
    post: async (url, params) => cb((await post(url, params)) || _default),
    put: async (url, params) => cb((await put(url, params)) || _default),
    remove: async (url, params) => cb((await remove(url, params)) || _default),
})
