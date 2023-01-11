import { useEffect, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { deletePresentation, setEditingState } from 'apis/presentation.api'
import { getFirst as getFirstSlide } from 'apis/slide.api'
import { getAllByHostId } from 'common/queries-fn/presentations.query'

import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import {
    BoltIcon,
    CircleStackIcon,
    EllipsisVerticalIcon,
    FireIcon,
} from '@heroicons/react/24/outline'
import CLoading from 'common/components/CLoading'
import { Dropdown } from 'flowbite-react'
import { slideSocket } from 'common/socket'

function MPresentationList() {
    //#region data
    const navigate = useNavigate()
    const localUser = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        if (!localUser) {
            alert('Login to use this feature')
            navigate('/auth/login')
        }
    }, [localUser, navigate])

    const { data, isLoading, refetch } = getAllByHostId({}, false, { staleTime: 0 })
    const presentations = useMemo(() => data?.data ?? [], [data])
    //#endregion

    //#endregion event

    const handleDelPresentation = async (presentationId) => {
        const res = await deletePresentation(presentationId)

        if (res?.data?.status) refetch()
    }

    const handleDropdownClick = (e) => e.stopPropagation()

    const handlePresentationClick = (mode, presentationId) => () =>
        navigate(
            `/presentation-slide${mode === 'session' ? '-session' : ''}/${presentationId}/host`
        )

    const handleEditPresentation = async (presentationId) => {
        const res = await getFirstSlide({
            presentationId: presentationId,
        })

        if (res?.data) {
            await setEditingState({ presentationId, isEditing: 1 })
            navigate(`/presentation/${presentationId}/${res?.data?.id}/edit`)
        }
    }
    //#endregion

    if (isLoading) {
        return <CLoading />
    }

    return (
        <div className="mx-2 pt-10 md:mx-10 lg:mx-20 xl:mx-40 2xl:mx-60">
            <div className="bg-white p-5">
                <button
                    onClick={() => navigate('/presentation/create')}
                    className="ml-4 flex items-center rounded bg-blue-600 py-1 pr-4 text-sm font-semibold text-white"
                >
                    <PlusCircleIcon className="mx-2 h-8 w-8" />
                    Create presentation
                </button>
                <div className="container grid grid-cols-1 gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {presentations.map((presentation, index) => {
                        return (
                            <div
                                key={index}
                                className={`cursor-pointer overflow-hidden rounded border border-gray-300 bg-white ${
                                    presentation.is_editing && 'cursor-not-allowed'
                                }`}
                                title={
                                    presentation.is_editing
                                        ? 'This presentation is being edited!'
                                        : 'Presentation'
                                }
                                onClick={() =>
                                    presentation.is_editing
                                        ? null
                                        : handleEditPresentation(presentation?.id)
                                }
                            >
                                <div className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <div className="mb-2 flex-1 text-xl font-bold">
                                            <h2>{presentation?.name}</h2>
                                        </div>

                                        {presentation?.owner_id === localUser.id && (
                                            <div onClick={handleDropdownClick}>
                                                <Dropdown
                                                    arrowIcon={false}
                                                    inline={true}
                                                    placement="right"
                                                    label={
                                                        <EllipsisVerticalIcon className="h-7 w-7" />
                                                    }
                                                >
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={handlePresentationClick(
                                                            'storage',
                                                            presentation.id
                                                        )}
                                                    >
                                                        <Dropdown.Item className="cursor-pointer text-[#1A94FF]">
                                                            <CircleStackIcon className="mr-2 h-4 w-4 cursor-pointer text-[#1A94FF]" />
                                                            <span>Present with storage</span>
                                                        </Dropdown.Item>
                                                    </div>
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={handlePresentationClick(
                                                            'session',
                                                            presentation.id
                                                        )}
                                                    >
                                                        <Dropdown.Item className="cursor-pointer text-[#1A94FF]">
                                                            <BoltIcon className="mr-2 h-4 w-4 cursor-pointer text-red-600" />
                                                            <span>Present in session</span>
                                                        </Dropdown.Item>
                                                    </div>
                                                    {localUser?.id === presentation?.owner_id && (
                                                        <Dropdown.Item
                                                            className="cursor-pointer text-red-600"
                                                            onClick={() =>
                                                                handleDelPresentation(
                                                                    presentation?.id
                                                                )
                                                            }
                                                        >
                                                            <XMarkIcon className="h-6 w-6 cursor-pointer pr-1 text-red-600" />
                                                            <h3>Delete</h3>
                                                        </Dropdown.Item>
                                                    )}
                                                </Dropdown>
                                            </div>
                                        )}
                                    </div>
                                    {/* <button to={``}> */}
                                    <div className="text-md mb-2 flex items-center">
                                        <div>
                                            <FireIcon className="mr-2 h-5 w-5" />
                                        </div>
                                        <span className="text-left">
                                            You are{' '}
                                            {presentation?.owner_id === localUser.id
                                                ? 'Owner'
                                                : 'Co-owner'}{' '}
                                            of this presentation
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MPresentationList
