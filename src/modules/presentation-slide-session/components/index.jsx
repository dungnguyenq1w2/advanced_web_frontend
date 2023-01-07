import { lazy } from 'react'

import MSlideSession from './MSlideSession'
const MHostMultipleChoiceSession = lazy(() => import('./MHostMultipleChoiceSession'))
const MMemberMultipleChoiceSession = lazy(() => import('./MMemberMultipleChoiceSession'))

export { MSlideSession, MHostMultipleChoiceSession, MMemberMultipleChoiceSession }
