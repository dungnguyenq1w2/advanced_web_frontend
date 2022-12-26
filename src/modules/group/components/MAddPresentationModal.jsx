import { forwardRef, useImperativeHandle, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import CLoading from 'common/components/CLoading'
import CModal from 'common/components/CModal'

import { getFirst as getFirstSlide } from 'apis/slide.api'
import { getAllByHostId } from 'common/queries-fn/presentations.query'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Tooltip } from 'flowbite-react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

// eslint-disable-next-line no-empty-pattern
const MAddPresentationModal = forwardRef(({}, ref) => {
    //#region data

    const navigate = useNavigate()
    // const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { data, isLoading } = getAllByHostId()
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

    const handleViewPresentation = (presentationId) => async () => {
        const res = await getFirstSlide({
            presentationId: presentationId,
        })

        if (res?.data) {
            navigate(`/presentation/${presentationId}/${res?.data?.id}/edit`)
        }
    }
    //#endregion

    return (
        <>
            <CModal isOpen={isOpen} onClose={handleClose}>
                <Dialog.Panel className="w-80 max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="px-8 py-4 text-center text-xl font-medium leading-6 text-gray-900"
                    >
                        Add presentation
                    </Dialog.Title>
                    <XMarkIcon
                        className="absolute top-2 right-2 h-10 w-10 cursor-pointer text-gray-700"
                        onClick={handleClose}
                    />
                    <hr />
                    <div className="p-4 text-left">
                        {isLoading ? (
                            <CLoading />
                        ) : (
                            data.data.map((presentation) => (
                                <div
                                    key={presentation.id}
                                    className="flex justify-between border-b py-2"
                                >
                                    <span
                                        className="cursor-pointer font-semibold hover:text-blue-600"
                                        onClick={handleViewPresentation(presentation.id)}
                                    >
                                        <Tooltip content="View this presentation">
                                            {presentation.name}
                                        </Tooltip>
                                    </span>
                                    <PlusCircleIcon className="h-6 w-6 cursor-pointer text-blue-600" />
                                </div>
                            ))
                        )}
                    </div>
                </Dialog.Panel>
            </CModal>
        </>
    )
})

export default MAddPresentationModal
