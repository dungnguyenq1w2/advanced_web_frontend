import { useEffect, useMemo, useRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { getById } from 'common/queries-fn/groups.query'

import {
    Bars3BottomLeftIcon,
    FireIcon,
    UserGroupIcon,
    UserPlusIcon,
    ViewfinderCircleIcon,
} from '@heroicons/react/24/outline'
import { Button } from 'flowbite-react'
import MParticipantsModal from '../components/MParticipantsModal'
import MShareModal from '../components/MShareModal'
import CLoading from 'common/components/CLoading'
import { ROLE, ROLE_ASSIGNMENT } from 'common/constant'

function MGroup() {
    //#region data
    const { groupId } = useParams()
    const navigate = useNavigate()
    const shareModalRef = useRef()
    const participantsModalRef = useRef()
    const { data, isLoading, set } = getById(groupId)
    const group = useMemo(() => data?.data ?? {}, [data])
    //#endregion

    //#region event
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) {
            alert('Login to use this feature')
            navigate('/auth/login')
        }
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
        set({ ...data, data: newGroup })
    }
    //#endregion

    if (isLoading) return <CLoading />
    return (
        <div className="flex flex-col items-center pt-20">
            <div className="mb-1 w-[52rem] rounded border bg-white p-5">
                <h1 className="text-xl font-semibold">Still waiting for responses</h1>
                <p className="w-[40rem] text-base text-gray-500">
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
            <div className="w-[52rem] rounded border bg-white p-5">
                <h1 className="mb-10 text-xl font-semibold">{group.name}</h1>
                <div className="">
                    <div className="my-1 flex items-center">
                        <FireIcon className="mr-2 h-5 w-5" />
                        {ROLE[group.my_role]}
                    </div>
                    <div className="my-1 flex items-center">
                        <Bars3BottomLeftIcon className="mr-2 h-5 w-5" />
                        {group.description}
                    </div>
                    <div className="my-1 flex items-center">
                        <UserGroupIcon className="mr-2 h-5 w-5" />
                        Participants ({group?.participants?.length ?? 0})
                        <ViewfinderCircleIcon
                            onClick={() => participantsModalRef.current.open()}
                            className="ml-2 h-6 w-6 cursor-pointer text-blue-500"
                        />
                    </div>
                </div>
            </div>

            <MShareModal ref={shareModalRef} />
            <MParticipantsModal
                ref={participantsModalRef}
                participants={group.participants}
                onRoleChange={handleChangeRole}
                set={set}
            />
        </div>
    )
}

export default MGroup
