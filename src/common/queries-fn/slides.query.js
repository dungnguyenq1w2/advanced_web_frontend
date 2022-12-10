import { createQuery } from 'utils/react-query'

import * as slides from 'apis/slide.api'

export function getForHost(id, isLoading = false, options = {}) {
    return createQuery(['slides-host', id], () => slides.getForHost(id), {
        enabled: !isLoading,
        ...options,
    })
}

export function getForGuest(id, isLoading = false, options = {}) {
    return createQuery(
        ['slides-guest', id],
        ({ queryKey: [, _params] }) => slides.getForGuest(id, _params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
