import { createQuery } from 'utils/react-query'

import * as groups from 'apis/group.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(['groups', params], ({ queryKey: [, _params] }) => groups.getAll(_params), {
        enabled: !isLoading,
        ...options,
    })
}

export function getById(id, isLoading = false, options = {}) {
    return createQuery(['groups', id], () => groups.getById(id), {
        enabled: !isLoading,
        ...options,
    })
}

export function getInviteCode(id, params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['invite-link', params],
        ({ queryKey: [, _params] }) => groups.generateInviteCode(id, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
