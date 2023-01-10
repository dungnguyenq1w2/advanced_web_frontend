import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import CLoading from 'common/components/CLoading'
import CModal from 'common/components/CModal'

import { getFirst as getFirstSlide } from 'apis/slide.api'
import { getAllByHostId as getAllPresentationsByHostId } from 'common/queries-fn/presentations.query'

import { CheckIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Tooltip } from 'flowbite-react'
import { addToGroup as addPresentationToGroup } from 'apis/presentation.api'

// eslint-disable-next-line no-empty-pattern
const MAddPresentationModal = forwardRef(
    ({ presentations, groupId, refetchPresentations }, ref) => {
        //#region data

        const navigate = useNavigate()
        const [isLoading, setIsLoading] = useState(false)
        const [isOpen, setIsOpen] = useState(false)
        const { data, isLoading: isDataLoading } = getAllPresentationsByHostId()

        const remainPresentations = useMemo(() => {
            let result = []
            if (data?.data) {
                for (const presentation of data?.data) {
                    const index = presentations.findIndex(
                        (item) => item?.presentation_id === presentation?.id
                    )

                    if (index === -1) {
                        result.push(presentation)
                    }
                }
            }

            return result
        }, [data, presentations])

        // console.log('🚀 ~ data', data)
        // console.log('🚀 ~ presentations', presentations)
        // console.log('🚀 ~ remainPresentations', remainPresentations)

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
            setIsLoading(true)
            await addPresentationToGroup({
                presentationId,
                groupId,
            })
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
            refetchPresentations()
        }
        //#endregion

        return (
            <>
                <CModal title="Add presentation" isOpen={isOpen} onClose={handleClose}>
                    <div className="h-[400px] overflow-auto p-4 text-left">
                        {isDataLoading ? (
                            <CLoading />
                        ) : (
                            remainPresentations.map((presentation) => (
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
                                    <PlusCircleIcon
                                        onClick={handleAddPresentation(presentation.id)}
                                        className="h-6 w-6 cursor-pointer text-blue-600"
                                    />
                                </div>
                            ))
                        )}
                        {isLoading && <CLoading />}
                    </div>
                </CModal>
            </>
        )
    }
)

export default MAddPresentationModal
