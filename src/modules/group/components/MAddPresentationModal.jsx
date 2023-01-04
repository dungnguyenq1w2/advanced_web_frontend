import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import CLoading from 'common/components/CLoading'
import CModal from 'common/components/CModal'

import { getFirst as getFirstSlide } from 'apis/slide.api'
import { getAllByHostId } from 'common/queries-fn/presentations.query'

import { CheckIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Tooltip } from 'flowbite-react'

// eslint-disable-next-line no-empty-pattern
const MAddPresentationModal = forwardRef(({}, ref) => {
    //#region data

    const navigate = useNavigate()
    // const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { data, isLoading } = getAllByHostId()

    // const activePresentations = useMemo(
    //     () => data?.data?.filter((item) => item?.is_presenting === true) ?? [],
    //     [data]
    // )

    // console.log('data: ', data)
    // console.log('active: ', activePresentations)

    const [isAddedPresentation, setIsAddedPresentation] = useState(false)
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

    const handleAddPresentation = (presentationId) => async () => {
        // setIsAddedPresentation(!isAddedPresentation)
    }
    //#endregion

    return (
        <>
            <CModal title="Add presentation" isOpen={isOpen} onClose={handleClose}>
                <div className="h-[400px] overflow-auto p-4 text-left">
                    {isLoading ? (
                        <CLoading />
                    ) : (
                        data?.data?.map((presentation) => (
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
                                {isAddedPresentation ? (
                                    <PlusCircleIcon
                                        onClick={handleAddPresentation(presentation.id)}
                                        className="h-6 w-6 cursor-pointer text-blue-600"
                                    />
                                ) : (
                                    <XMarkIcon
                                        onClick={handleAddPresentation(presentation.id)}
                                        className="h-6 w-6 cursor-pointer text-red-600"
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CModal>
        </>
    )
})

export default MAddPresentationModal
