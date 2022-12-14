import { createQuery } from 'utils/react-query'

import * as presentations from 'apis/presentation.api'

export function getAllByHostId(params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['presentations'],
        ({ queryKey: [, _params] }) => presentations.getAllByHostId(_params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}

export function getAllSlidesById(presentationId, params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['presentations-slides', presentationId],
        ({ queryKey: [, _params] }) => presentations.getAllSlidesById(presentationId, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
