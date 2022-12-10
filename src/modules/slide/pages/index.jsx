import { lazy } from 'react'

const HostSlide = lazy(() => import('./MHostSlide'))
const GuestSlide = lazy(() => import('./MGuestSlide'))

export { HostSlide, GuestSlide }
