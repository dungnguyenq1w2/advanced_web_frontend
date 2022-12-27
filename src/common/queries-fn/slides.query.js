import { createQuery } from 'utils/react-query'

import * as slides from 'apis/slide.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(['slides', params], ({ queryKey: [, _params] }) => slides.getAll(_params), {
        enabled: !isLoading,
        ...options,
    })
}

export function getById(id, isLoading = false, options = {}) {
    return createQuery(['slides', id], () => slides.getById(id), {
        enabled: !isLoading,
        ...options,
    })
}

export function getForHostById(id, params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['slides-host', id, params],
        ({ queryKey: [, , _params] }) => slides.getForHostById(id, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}

export function getForMemberById(id, params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['slides-member', id, params],
        ({ queryKey: [, , _params] }) => slides.getForMemberById(id, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
