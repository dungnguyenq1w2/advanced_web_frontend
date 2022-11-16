import { lazy } from 'react'

const Group = lazy(() => import('./MGroup'))
const GroupList = lazy(() => import('./MGroupList'))

export { Group, GroupList }
