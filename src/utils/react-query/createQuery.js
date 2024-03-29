/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { set, refetch } from '.'

const createQuery = (key, func, options = {}) => {
    const { data, isLoading, ...query } = useQuery(key, func, options)

    const _data = useMemo(
        () => (data ? (options.map ? options.map(data) : data) : undefined),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isLoading, data]
    )

    return {
        ...query,
        isLoading,
        data: _data,
        set: (nData) => set(key, nData),
        refetch: () => refetch(key),
    }
}

export default createQuery
