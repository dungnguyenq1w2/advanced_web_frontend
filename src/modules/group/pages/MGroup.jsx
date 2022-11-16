import CLoading from 'common/components/CLoading'
import { getById } from 'common/queries-fn/groups.query'
import React from 'react'
import { useParams } from 'react-router-dom'

function MGroup() {
    const { groupId } = useParams()
    const { data: _data, isLoading } = getById(groupId)
    console.log('🚀 ~ _data', _data)
    if (isLoading) return <CLoading />
    return <div>group</div>
}

export default MGroup
