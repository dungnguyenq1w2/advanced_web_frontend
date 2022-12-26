import { createQuery } from 'utils/react-query'

import * as presentations from 'apis/presentation.api'

export function getAllByHostId(isLoading = false, options = {}) {
    return createQuery(
        ['presentations'],
        ({ queryKey: [, _params] }) => presentations.getAllByHostId(_params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}

export function getAllByGroupId(groupId, isLoading = false, options = {}) {
    return createQuery(
        ['presentations-group', groupId],
        ({ queryKey: [, _params] }) => presentations.getAllByGroupId(groupId, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}

export function getForHostById(presentationId, params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['presentation-host', presentationId, params],
        ({ queryKey: [, , _params] }) => presentations.getForHostById(presentationId, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}

export function getForMemberById(presentationId, params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['presentation-member', presentationId, params],
        ({ queryKey: [, , _params] }) => presentations.getForMemberById(presentationId, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
