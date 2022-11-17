import { forwardRef, useImperativeHandle, useState } from 'react'

import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'

const MParticipantsModal = forwardRef(({}, ref) => {
    //#region data
    const [isOpen, setIsOpen] = useState(false)
    //#endregion

    //#region event
    useImperativeHandle(
        ref,
        () => ({
            open: (id) => {
                setIsOpen(true)
            },
        }),
        []
    )
    const handleClose = () => {
        setIsOpen(false)
    }
    //#endregion

    return (
        <CModal isOpen={isOpen} onClose={handleClose}>
            <Dialog.Panel className="max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                    as="h3"
                    className="px-8 py-4 text-center text-xl font-medium leading-6 text-gray-900"
                >
                    Participants
                </Dialog.Title>
                <XMarkIcon
                    className="absolute top-2 right-2 h-10 w-10 cursor-pointer text-gray-700"
                    onClick={handleClose}
                />
                <hr />
                <div className="h-40 w-80"></div>
            </Dialog.Panel>
        </CModal>
    )
})

export default MParticipantsModal
