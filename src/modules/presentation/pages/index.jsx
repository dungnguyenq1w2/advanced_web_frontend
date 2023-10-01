import { lazy } from 'react'

const PresentationList = lazy(() => import('./MPresentationList'))
const PresentationCreate = lazy(() => import('./MPresentationCreate'))
const PresentationEdit = lazy(() => import('./MPresentationEdit'))

export { PresentationList, PresentationCreate, PresentationEdit }
