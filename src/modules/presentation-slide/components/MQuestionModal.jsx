import 'modules/presentation-slide/assets/style/index.css'

import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Avatar, Tabs, Tooltip } from 'flowbite-react'
import moment from 'moment'

const MQuestionModal = ({ isOpen, onClose }) => {
    //#region data
    //#endregion

    //#region event
    //#endregion

    return (
        <>
            <CModal title="Question" isOpen={isOpen} onClose={onClose}>
                <div className="h-[450px] overflow-auto">Question</div>
            </CModal>
        </>
    )
}

export default MQuestionModal
