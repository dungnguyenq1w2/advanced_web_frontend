import { createQuery } from 'utils/react-query'

import * as messages from 'apis/message.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['messages', params],
        ({ queryKey: [, _params] }) => messages.getAll(_params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
