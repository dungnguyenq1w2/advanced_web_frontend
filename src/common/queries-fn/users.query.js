import { createQuery } from '/utils/react-query'

import * as users from '/apis/user.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(['users', params], ({ queryKey: [, _params] }) => users.getAll(_params), {
        enabled: !isLoading,
        ...options,
    })
}

// export function getById(code: string | number, isLoading = false, options = {}) {
//     return createQuery(['transfer', code], () => users.getById(code), {
//         enabled: !isLoading,
//         ...options,
//     })
// }
