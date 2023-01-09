import { lazy } from 'react'

const HostSlideSession = lazy(() => import('./MHostSlideSession'))
const MemberSlideSession = lazy(() => import('./MMemberSlideSession'))

export { HostSlideSession, MemberSlideSession }
