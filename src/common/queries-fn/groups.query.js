import { createQuery } from 'utils/react-query'

import * as groups from 'apis/group.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(['groups', params], ({ queryKey: [, _params] }) => groups.getAll(_params), {
        enabled: !isLoading,
        ...options,
    })
}

export function getById(code, isLoading = false, options = {}) {
    return createQuery(['groups', code], () => groups.getById(code), {
        enabled: !isLoading,
        ...options,
    })
}