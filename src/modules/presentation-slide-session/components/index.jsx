import { lazy } from 'react'

import MSlideSession from './MSlideSession'
import MChatboxModalSession from './MChatboxSession/MChatboxModalSession'
import MQuestionModalSession from './MQuestionSession/MQuestionModalSession'
const MHostMultipleChoiceSession = lazy(() => import('./MHostMultipleChoiceSession'))
const MMemberMultipleChoiceSession = lazy(() => import('./MMemberMultipleChoiceSession'))

export {
    MSlideSession,
    MChatboxModalSession,
    MQuestionModalSession,
    MHostMultipleChoiceSession,
    MMemberMultipleChoiceSession,
}
