import { createQuery } from 'utils/react-query'

import * as presentations from 'apis/presentation.api'

export function getAllByHostId(hostId, params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['presentations', hostId],
        ({ queryKey: [, _params] }) => presentations.getAllByHostId(hostId, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}