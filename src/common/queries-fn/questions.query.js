import { createQuery } from 'utils/react-query'

import * as questions from 'apis/question.api'

export function getAll(params = {}, isLoading = false, options = {}) {
    return createQuery(
        ['questions', params],
        ({ queryKey: [, _params] }) => questions.getAll(_params),
        {
            enabled: !isLoading,
            ...options,
        }
    )
}
