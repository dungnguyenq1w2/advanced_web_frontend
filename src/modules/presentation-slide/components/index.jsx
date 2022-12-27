import { lazy } from 'react'

import MCheckbox from './MCheckbox'
import MSlide from './MSlide'
import MResultsModal from './MResultsModal'
import MChatboxModal from './MChatboxModal'
import MQuestionModal from './MQuestionModal'
import MHeading from './MHeading'
import MParagraph from './MParagraph'
const MHostMultipleChoice = lazy(() => import('./MHostMultipleChoice'))
const MMemberMultipleChoice = lazy(() => import('./MMemberMultipleChoice'))

export {
    MCheckbox,
    MSlide,
    MResultsModal,
    MChatboxModal,
    MQuestionModal,
    MHeading,
    MParagraph,
    MHostMultipleChoice,
    MMemberMultipleChoice,
}
