import { lazy } from 'react'

const Group = lazy(() => import('./MGroup'))
const GroupList = lazy(() => import('./MGroupList'))
const GroupCreate = lazy(() => import('./MGroupCreate'))

export { Group, GroupList, GroupCreate }
