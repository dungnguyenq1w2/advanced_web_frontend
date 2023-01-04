import { useEffect, useMemo, useRef, useState } from 'react'

import { createSearchParams, useNavigate, useParams } from 'react-router-dom'

import { getById } from 'common/queries-fn/groups.query'
import { getAllByGroupId as getAllPresentationByGroupId } from 'common/queries-fn/presentations.query'

import CChatboxModal from 'common/components/CChatbox/CChatboxModal'
import CLoading from 'common/components/CLoading'
import CQuestionModal from 'common/components/CQuestion/CQuestionModal'

import {
    Bars3BottomLeftIcon,
    FireIcon,
    PlusCircleIcon,
    QrCodeIcon,
    UserGroupIcon,
    UserPlusIcon,
    ViewfinderCircleIcon,
} from '@heroicons/react/24/outline'
import { ROLE, ROLE_ASSIGNMENT } from 'common/constant'
import { Button } from 'flowbite-react'
import {
    MAddPresentationModal,
    MParticipantsModal,
    MResultsModal,
    MShareModal,
} from '../components'
import { PlayIcon } from '@heroicons/react/20/solid'

function MGroup() {
    //#region data
    const { groupId } = useParams()
    const navigate = useNavigate()

    const shareModalRef = useRef()
    const participantsModalRef = useRef()
    const addPresentationModalRef = useRef()

    const [isResultModalOpen, setIsResultModalOpen] = useState(false)
    const [isChatboxModalOpen, setIsChatboxModalOpen] = useState(false)
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)

    const [presentationIdSelected, setPresentationIdSelected] = useState(null)
    const [presentationGroupIdSelected, setPresentationGroupIdSelected] = useState(null)

    const {
        data: groupData,
        isLoading: isGroupLoading,
        set,
        refetch,
    } = getById(groupId, false, { staleTime: 0 })
    const group = useMemo(() => groupData?.data ?? {}, [groupData])

    const { data: presentationsData, isLoading: isPresentationsLoading } =
        getAllPresentationByGroupId(groupId)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(3)

    const presentations = useMemo(
        () =>
            presentationsData?.data?.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            ) ?? [],
        [presentationsData, currentPage, itemsPerPage]
    )

    const totalPages = useMemo(
        () => Math.ceil((presentationsData?.data?.length ?? 0) / itemsPerPage),
        [presentationsData, itemsPerPage]
    )

    console.log('presentations: ', presentationsData?.data)
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
                console.log(newGroup)
                // set({ ...data, data: newGroup })

                break

            default:
                break
        }
        set({ ...groupData, data: newGroup })
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
                        <div>
                            {presentations?.map((row) => (
                                <div
                                    key={row.id}
                                    className={`relative mt-2 flex h-[90px] flex-col justify-between rounded border border-slate-300 px-1 shadow-lg`}
                                >
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="ml-2 mt-1 truncate font-bold">
                                                {row.presentation.name}
                                            </span>
                                            {row?.is_presenting ? (
                                                <div className="flex justify-end">
                                                    <span className="flex h-3 w-3">
                                                        <span className="absolute top-[10px] inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="absolute top-[10px] inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                                                    </span>
                                                    <span className="relative rounded p-1 font-bold text-green-500">
                                                        Presenting
                                                    </span>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div className="ml-2 flex items-center">
                                            <QrCodeIcon className="h-4 w-4" />
                                            <span className="ml-1 text-sm">
                                                {row.presentation.code}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap">
                                        {group.my_role !== 3 && !row?.is_presenting && (
                                            <button
                                                className="m-1 rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                onClick={() =>
                                                    navigate({
                                                        pathname: `/presentation-slide/${row.presentation.id}/host`,
                                                        search: createSearchParams({
                                                            id: row.id, // presentation_group_id
                                                        }).toString(),
                                                    })
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <PlayIcon className="h-4 w-4" />
                                                    <span>Present</span>
                                                </div>
                                            </button>
                                        )}

                                        {group.my_role !== 3 && (
                                            <button
                                                className="m-1 rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                onClick={() => {
                                                    setIsResultModalOpen(true)
                                                    setPresentationIdSelected(row.presentation.id)
                                                    setPresentationGroupIdSelected(row.id)
                                                }}
                                            >
                                                View results
                                            </button>
                                        )}
                                        <button
                                            className="m-1 rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                            onClick={() => {
                                                setIsQuestionModalOpen(true)
                                                setPresentationIdSelected(row.presentation.id)
                                                setPresentationGroupIdSelected(row.id)
                                            }}
                                        >
                                            Open question
                                        </button>
                                        <button
                                            className="m-1 rounded p-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                            onClick={() => {
                                                setIsChatboxModalOpen(true)
                                                setPresentationIdSelected(row.presentation.id)
                                                setPresentationGroupIdSelected(row.id)
                                            }}
                                        >
                                            Open chatbox
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-2 flex justify-center">
                                <button
                                    className={`mx-1 rounded px-1 text-sm font-medium ${
                                        currentPage === 1
                                            ? 'text-gray-700 opacity-50'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        if (currentPage - 1 >= 1) setCurrentPage(currentPage - 1)
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
                        </div>
                    )}
                </div>
            </div>

            <MShareModal ref={shareModalRef} />
            <MParticipantsModal
                ref={participantsModalRef}
                participants={group.participants}
                onRoleChange={handleChangeRole}
                set={set}
                refetch={refetch}
            />
            <MAddPresentationModal ref={addPresentationModalRef} />
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
                />
            )}
        </div>
    )
}

export default MGroup
