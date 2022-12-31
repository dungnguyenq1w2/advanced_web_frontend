import { createQuery } from 'utils/react-query'

import * as notifications from 'apis/notification.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['notifications', params],
        ({ queryKey: [, _params] }) => notifications.getAll(_params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
