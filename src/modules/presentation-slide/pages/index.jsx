import { lazy } from 'react'

const HostSlide = lazy(() => import('./MHostSlide'))
const MemberSlide = lazy(() => import('./MMemberSlide'))

export { HostSlide, MemberSlide }
