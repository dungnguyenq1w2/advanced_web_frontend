import { createQuery } from 'utils/react-query'

import * as choices from 'apis/choice.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['choices', params],
        ({ queryKey: [, _params] }) => choices.getAll(_params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}

export function getById(id, isLoading = false, options = {}) {
    return createQuery(['choices', id], () => choices.getById(id), {
        enabled: !isLoading,
        ...options,
    })
}
