import { lazy } from 'react'

const Group = lazy(() => import('./MGroup'))
const GroupList = lazy(() => import('./MGroupList'))
const GroupCreate = lazy(() => import('./MGroupCreate'))
const GroupInvite = lazy(() => import('./MGroupInvite'))

export { Group, GroupList, GroupCreate, GroupInvite }
