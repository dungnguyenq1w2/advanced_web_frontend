import { lazy } from 'react'

import MCheckbox from './MCheckbox'
import MSlide from './MSlide'
import MResultsModal from './MResultsModal'
import MHeading from './MHeading'
import MParagraph from './MParagraph'
const MHostMultipleChoice = lazy(() => import('./MHostMultipleChoice'))
const MMemberMultipleChoice = lazy(() => import('./MMemberMultipleChoice'))

export {
    MCheckbox,
    MSlide,
    MResultsModal,
    MHeading,
    MParagraph,
    MHostMultipleChoice,
    MMemberMultipleChoice,
}
