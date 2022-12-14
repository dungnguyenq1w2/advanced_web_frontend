import { forwardRef, useImperativeHandle, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { getFirst as getFirstSlide, remove as removeSlide } from 'apis/slide.api'

import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const MConfirmationModal = forwardRef(({ slideId, refetchSlides, presentationId }, ref) => {
    //#region data
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    //#endregion

    //#region event
    useImperativeHandle(
        ref,
        () => ({
            open: () => {
                setIsOpen(true)
            },
        }),
        []
    )

    const handleCloseModal = () => {
        setIsOpen(false)
    }

    const handleDeleteSlide = async () => {
        try {
            await removeSlide(slideId)
            await refetchSlides()

            const res = await getFirstSlide({
                presentationId: presentationId,
            })

            if (res?.data) {
                navigate(`/presentation/${presentationId}/${res?.data?.id}/edit`)
            }

            setIsOpen(false)
        } catch (error) {
            setIsOpen(false)
            console.log('Error', error)
        }
    }
    //#endregion

    return (
        <CModal isOpen={isOpen} onClose={handleCloseModal}>
            <Dialog.Panel className="max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                    as="h3"
                    className="px-10 py-4 text-center text-lg font-medium leading-6 text-gray-900"
                >
                    Are you sure you want to delete this slide?
                </Dialog.Title>
                <XMarkIcon
                    className="absolute top-3 right-1 h-8 w-8 cursor-pointer text-gray-900"
                    onClick={handleCloseModal}
                />
                <hr />
                <div className="h-[140px]">
                    <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                        <div className="p-6 text-center">
                            <h4 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                This will permanently delete this slide
                            </h4>
                            <button
                                type="button"
                                onClick={handleDeleteSlide}
                                className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-8 py-2.5 text-center text-lg font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="rounded-lg border border-gray-200 bg-white px-8 py-2.5 text-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog.Panel>
        </CModal>
    )
})

export default MConfirmationModal
