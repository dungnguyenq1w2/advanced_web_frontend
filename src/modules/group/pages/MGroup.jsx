import { useEffect, useMemo, useRef, useState } from 'react'

import { createSearchParams, useNavigate, useParams } from 'react-router-dom'

import { getById } from 'common/queries-fn/groups.query'
import { getAllByGroupId as getAllPresentationByGroupId } from 'common/queries-fn/presentations.query'

import { presentationSocket, notificationSocket } from 'common/socket'
import CChatboxModal from 'common/components/CChatbox/CChatboxModal'
import CLoading from 'common/components/CLoading'
import CQuestionModal from 'common/components/CQuestion/CQuestionModal'

import { getFirst as getFirstSlide } from 'apis/slide.api'

import {
    Bars3BottomLeftIcon,
    BoltIcon,
    ChatBubbleBottomCenterTextIcon,
    CircleStackIcon,
    DocumentChartBarIcon,
    FireIcon,
    PlusCircleIcon,
    QrCodeIcon,
    QuestionMarkCircleIcon,
    UserGroupIcon,
    UserPlusIcon,
    ViewfinderCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ROLE, ROLE_ASSIGNMENT } from 'common/constant'
import { Button, Dropdown, Tooltip } from 'flowbite-react'
import {
    MAddPresentationModal,
    MParticipantsModal,
    MResultsModal,
    MShareModal,
} from '../components'
import { PlayIcon } from '@heroicons/react/20/solid'
import { removeFromGroup as removePresentationFromGroup } from 'apis/presentation.api'

const ITEM_PER_PAGE = 5

function MGroup() {
    //#region data
    const { groupId } = useParams()
    const navigate = useNavigate()

    const shareModalRef = useRef()
    const participantsModalRef = useRef()
    const addPresentationModalRef = useRef()

    const [isRemovingPresentation, setIsRemovingPresentation] = useState(false)
    const [isResultModalOpen, setIsResultModalOpen] = useState(false)
    const [isChatboxModalOpen, setIsChatboxModalOpen] = useState(false)
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
    const [presentingPresentation, setPresentingPresentation] = useState({
        content: null,
        presentationId: null,
    })

    const [presentingMode, setPresentingMode] = useState('')

    const [presentationIdSelected, setPresentationIdSelected] = useState(null)
    const [presentationGroupIdSelected, setPresentationGroupIdSelected] = useState(null)

    const {
        data: groupData,
        isLoading: isGroupLoading,
        set,
        refetch,
    } = getById(groupId, false, { staleTime: 0 })
    const group = useMemo(() => groupData?.data ?? {}, [groupData])

    const {
        data: presentationsData,
        isLoading: isPresentationsLoading,
        refetch: refetchPresentations,
        set: setPresentations,
    } = getAllPresentationByGroupId(groupId, false, { staleTime: 0 })

    const [currentPage, setCurrentPage] = useState(1)
    // const [itemsPerPage] = useState(5)

    const presentations = useMemo(
        () =>
            presentationsData?.data?.slice(
                (currentPage - 1) * ITEM_PER_PAGE,
                currentPage * ITEM_PER_PAGE
            ) ?? [],
        [presentationsData, currentPage]
    )

    const totalPages = useMemo(
        () => Math.ceil((presentationsData?.data?.length ?? 0) / ITEM_PER_PAGE),
        [presentationsData]
    )

    //#endregion

    //#region event
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) {
            alert('Login to use this feature')
            navigate('/auth/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        notificationSocket.on('server-present-presentation-noti', (noti) => {
            setPresentingMode(noti.mode)

            const index = noti.content.indexOf(' in ')
            const content = noti.content.slice(0, index)
            setPresentingPresentation((cur) =>
                cur.presentationId !== parseInt(noti.presentationId)
                    ? { content, presentationId: parseInt(noti.presentationId) }
                    : { content: null, presentationId: null }
            )

            //
            refetchPresentations()
        })

        notificationSocket.on('server-stop-presentation-noti', (data) => {
            setPresentingMode('')
            setPresentingPresentation((cur) =>
                cur.presentationId === parseInt(data.presentationId)
                    ? { content: null, presentationId: null }
                    : cur
            )

            //
            refetchPresentations()
        })

        return () => {
            notificationSocket.off('server-present-presentation-noti')
            notificationSocket.off('server-stop-presentation-noti')
        }
    }, [])

    useEffect(() => {
        if (presentationsData?.data?.length > 0) {
            const presentingPresentation = presentationsData.data.find(
                (e) => e.is_presenting === true
            )
            if (presentingPresentation) {
                setPresentingPresentation({
                    content: `Presentation [${presentingPresentation?.presentation?.name}] is presenting`,
                    presentationId: presentingPresentation?.presentation?.id,
                })
            }
        }
    }, [presentationsData])

    const handleChangeRole = (mode, userId) => {
        const index = group.participants.findIndex((e) => e.user.id === userId)
        let newGroup = { ...group, participants: [...group.participants] }
        switch (mode) {
            case ROLE_ASSIGNMENT.PROMOTE:
                newGroup.participants[index].role_id--
                break
            case ROLE_ASSIGNMENT.DEMOTE:
                newGroup.participants[index].role_id++
                break
            case ROLE_ASSIGNMENT.KICK_OUT:
                newGroup.participants.splice(index, 1)
                break
            case ROLE_ASSIGNMENT.SET_OWNER:
                newGroup.participants[index].role_id = 1
                newGroup.my_role = 2
                // console.log(newGroup)
                // set({ ...data, data: newGroup })

                break

            default:
                break
        }
        set({ ...groupData, data: newGroup })
    }

    const handlePresent = (mode, presentationId, presentationName, presentationGroupId) => {
        presentationSocket.open()
        presentationSocket.emit(
            'client-present-presentation',
            mode,
            presentationId,
            presentationName,
            groupId,
            group.name
        )
        navigate({
            pathname: `/presentation-slide${
                mode === 'session' ? '-session' : ''
            }/${presentationId}/host`,
            search: createSearchParams({
                id: presentationGroupId, // presentation_group_id
            }).toString(),
        })
    }

    const handleJoinPresentation = (mode, presentationId, presentationGroupId) => {
        navigate({
            pathname: `/presentation-slide${
                mode === 'session' ? '-session' : ''
            }/${presentationId}/member`,
            search: createSearchParams({
                id: presentationGroupId, // presentation_group_id
            }).toString(),
        })
    }

    // console.log('🚀 ~ presentationsData', presentationsData)
    const handleRemovePresentation = (presentationGroupId) => async () => {
        // setIsRemovingPresentation(true)
        // await removePresentationFromGroup(presentationGroupId)
        // setTimeout(() => {
        //     refetchPresentations()
        //     setIsRemovingPresentation(false)
        // }, 200)

        try {
            setIsRemovingPresentation(true)
            const newPresentations = [...presentationsData?.data].filter(
                (item) => item.id !== presentationGroupId
            )

            setPresentations({ ...presentationsData, data: newPresentations })
            // setTimeout(() => {
            //     setPresentations({ data: newPresentations })
            // }, 1000)

            await removePresentationFromGroup(presentationGroupId)
            // setTimeout(() => {
            //     setPresentations({ data: newPresentations })
            // }, 1000)

            console.log('🚀 ~ newPresentations', newPresentations)

            setIsRemovingPresentation(false)
            // setTimeout(() => {
            //     setIsRemovingPresentation(false)
            // }, 800)
        } catch (error) {
            setIsRemovingPresentation(false)
            console.log('🚀 ~ error', error)
        }
    }

    //#endregion

    if (isGroupLoading) return <CLoading />

    return (
        <div className="flex flex-col items-center pt-20">
            <div className="mb-1 w-[25rem] rounded border bg-white p-5 sm:w-[35rem] lg:w-[52rem]">
                <h1 className="text-sm font-semibold md:text-lg">Still waiting for responses</h1>
                <p className="mb-2 text-sm text-gray-500 md:text-base">
                    If you haven't shared your invite, copy the link or email to your participants.
                </p>
                <div className="flex justify-end">
                    <Button
                        disabled={group.my_role === 3}
                        size="md"
                        onClick={() => shareModalRef.current.open()}
                    >
                        <UserPlusIcon className="mr-2 h-5 w-5" /> Share invite
                    </Button>
                </div>
            </div>
            <div className="mb-1 w-[25rem] rounded border bg-white p-5 sm:w-[35rem] lg:w-[52rem]">
                <h1 className="mb-10 text-xl font-semibold">{group.name}</h1>
                <div className="">
                    <div className="my-1 flex items-center">
                        <FireIcon className="mr-2 h-5 w-5 text-red-600" />
                        {ROLE[group.my_role]}
                    </div>
                    <div className="my-1 flex items-center">
                        <Bars3BottomLeftIcon className="mr-2 h-5 w-5" />
                        {group.description}
                    </div>
                    <div className="my-1 flex items-center">
                        <UserGroupIcon className="mr-2 h-5 w-5 text-blue-600" />
                        Participants ({group?.participants?.length ?? 0})
                        <ViewfinderCircleIcon
                            onClick={() => participantsModalRef.current.open()}
                            className="ml-2 h-6 w-6 cursor-pointer text-blue-500"
                        />
                    </div>
                </div>
            </div>
            <div className="w-[25rem] rounded border bg-white p-5 sm:w-[35rem] lg:w-[52rem]">
                <div className="flex justify-between">
                    <h1 className="text-md mb-10 font-semibold md:text-lg">
                        Group's Presentations {`(${presentationsData?.data?.length})`}
                    </h1>
                    <Button
                        disabled={group.my_role !== 1}
                        size="md"
                        onClick={() => addPresentationModalRef.current.open()}
                    >
                        <PlusCircleIcon className="mr-2 h-6 w-6" /> Add presentation
                    </Button>
                </div>
                <div className="">
                    {isPresentationsLoading ? (
                        <CLoading />
                    ) : (
                        <>
                            <>
                                {presentations?.map((row) => (
                                    <div
                                        key={row.id}
                                        className={`relative mt-2 flex justify-between rounded border border-slate-300 px-1 shadow-md`}
                                    >
                                        <div className="flex flex-1 items-center">
                                            <span className="ml-2 truncate text-lg font-bold">
                                                {row.presentation.name}
                                            </span>
                                            <div className="ml-2 flex items-center">
                                                <QrCodeIcon className="h-4 w-4" />
                                                <span className="ml-1 text-sm">
                                                    {row.presentation.code}
                                                </span>
                                            </div>
                                            {row?.is_presenting ? (
                                                <div className="ml-3 flex items-center">
                                                    <span className="flex h-3 w-3">
                                                        <span className="absolute top-[14px] inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="absolute top-[14px] inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                                                    </span>
                                                    <span className="relative rounded p-1 font-bold text-green-500">
                                                        Presenting
                                                    </span>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap">
                                            {group.my_role !== 3 && !row?.is_presenting && (
                                                <button className="m-1 rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200">
                                                    <div className="flex items-center">
                                                        <Dropdown
                                                            className="w-48"
                                                            arrowIcon={false}
                                                            inline={true}
                                                            placement="right"
                                                            label={
                                                                <>
                                                                    <PlayIcon className="h-4 w-4" />
                                                                    <span>Present</span>
                                                                </>
                                                            }
                                                        >
                                                            <Dropdown.Item
                                                                className="cursor-pointer text-[#1A94FF]"
                                                                onClick={() =>
                                                                    handlePresent(
                                                                        'storage',
                                                                        row.presentation.id,
                                                                        row.presentation.name,
                                                                        row.id
                                                                    )
                                                                }
                                                            >
                                                                <CircleStackIcon className="mr-2 h-4 w-4 cursor-pointer text-[#1A94FF]" />
                                                                <span>Present with storage</span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                className="cursor-pointer text-red-600"
                                                                onClick={() =>
                                                                    handlePresent(
                                                                        'session',
                                                                        row.presentation.id,
                                                                        row.presentation.name,
                                                                        row.id
                                                                    )
                                                                }
                                                            >
                                                                <BoltIcon className="mr-2 h-4 w-4 cursor-pointer text-red-600" />
                                                                <span>Present in session</span>
                                                            </Dropdown.Item>
                                                        </Dropdown>
                                                    </div>
                                                </button>
                                            )}
                                            {group.my_role === 3 && row?.is_presenting && (
                                                <button
                                                    className="m-1 rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                    onClick={() =>
                                                        handleJoinPresentation(
                                                            presentingMode,
                                                            row.presentation.id,
                                                            row.id
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        <PlayIcon className="h-4 w-4" />
                                                        <span>Join</span>
                                                    </div>
                                                </button>
                                            )}

                                            {group.my_role !== 3 && (
                                                <button
                                                    className="m-1  rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                    onClick={() => {
                                                        setIsResultModalOpen(true)
                                                        setPresentationIdSelected(
                                                            row.presentation.id
                                                        )
                                                        setPresentationGroupIdSelected(row.id)
                                                    }}
                                                >
                                                    <Tooltip content="View result">
                                                        <DocumentChartBarIcon className="h-6 w-6" />
                                                    </Tooltip>
                                                </button>
                                            )}
                                            <button
                                                className="m-1  rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                onClick={() => {
                                                    setIsQuestionModalOpen(true)
                                                    setPresentationIdSelected(row.presentation.id)
                                                    setPresentationGroupIdSelected(row.id)
                                                }}
                                            >
                                                <Tooltip content="View questions">
                                                    <QuestionMarkCircleIcon className="h-6 w-6" />
                                                </Tooltip>
                                            </button>
                                            <button
                                                className="m-1  rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                onClick={() => {
                                                    setIsChatboxModalOpen(true)
                                                    setPresentationIdSelected(row.presentation.id)
                                                    setPresentationGroupIdSelected(row.id)
                                                }}
                                            >
                                                <Tooltip content="Open chatbox">
                                                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                                                </Tooltip>
                                            </button>
                                            <button
                                                className="m-1  rounded p-1 text-sm font-medium text-red-700 hover:bg-red-200"
                                                onClick={handleRemovePresentation(row.id)}
                                            >
                                                <Tooltip content="Remove">
                                                    <XMarkIcon className="h-6 w-6" />
                                                </Tooltip>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                            <>
                                {totalPages !== 0 && (
                                    <div className="mt-2 flex justify-center">
                                        <button
                                            className={`mx-1 rounded px-1 text-sm font-medium ${
                                                currentPage === 1
                                                    ? 'text-gray-700 opacity-50'
                                                    : 'text-gray-700 hover:bg-gray-200'
                                            }`}
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                if (currentPage - 1 >= 1)
                                                    setCurrentPage(currentPage - 1)
                                            }}
                                        >
                                            Previous
                                        </button>
                                        <span>{`${currentPage}/${totalPages}`}</span>
                                        <button
                                            className={`mx-1 rounded px-1 text-sm font-medium ${
                                                currentPage === totalPages
                                                    ? 'text-gray-700 opacity-50'
                                                    : 'text-gray-700 hover:bg-gray-200'
                                            }`}
                                            disabled={currentPage === totalPages}
                                            onClick={() => {
                                                if (currentPage + 1 <= totalPages)
                                                    setCurrentPage(currentPage + 1)
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        </>
                    )}
                </div>
                {isRemovingPresentation && <CLoading />}
            </div>

            <MShareModal ref={shareModalRef} />
            <MParticipantsModal
                ref={participantsModalRef}
                participants={group.participants}
                onRoleChange={handleChangeRole}
                set={set}
                refetch={refetch}
            />
            <MAddPresentationModal
                ref={addPresentationModalRef}
                presentations={presentationsData?.data ?? []}
                groupId={groupId}
                refetchPresentations={refetchPresentations}
            />
            {isResultModalOpen && (
                <MResultsModal
                    isOpen={isResultModalOpen}
                    onClose={() => setIsResultModalOpen(false)}
                    presentationId={presentationIdSelected}
                    presentationGroupId={presentationGroupIdSelected}
                />
            )}
            {isChatboxModalOpen && (
                <CChatboxModal
                    isOpen={isChatboxModalOpen}
                    onClose={() => setIsChatboxModalOpen(false)}
                    presentationId={presentationIdSelected}
                    presentationGroupId={presentationGroupIdSelected}
                />
            )}
            {isQuestionModalOpen && (
                <CQuestionModal
                    isOpen={isQuestionModalOpen}
                    onClose={() => setIsQuestionModalOpen(false)}
                    presentationId={presentationIdSelected}
                    presentationGroupId={presentationGroupIdSelected}
                    myRole={group.my_role ?? 3}
                />
            )}
            {presentingPresentation?.content && (
                <div className="fixed top-20 left-4 bg-white p-5 shadow">
                    {presentingPresentation.content}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px]"></span>
                    </span>
                </div>
            )}
        </div>
    )
}

export default MGroup
