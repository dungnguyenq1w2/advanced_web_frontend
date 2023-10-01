import { createQuery } from 'utils/react-query'

import * as users from 'apis/user.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(['users', params], ({ queryKey: [, _params] }) => users.getAll(_params), {
        enabled: !isLoading,
        ...options,
    })
}

export function getById(id, isLoading = false, options = {}) {
    return createQuery(['users', id], () => users.getById(id), {
        enabled: !isLoading,
        ...options,
    })
}
