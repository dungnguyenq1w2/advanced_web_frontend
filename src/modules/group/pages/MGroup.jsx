import React, { useRef, useState } from 'react'

import { useParams } from 'react-router-dom'

import CLoading from 'common/components/CLoading'
import { getById } from 'common/queries-fn/groups.query'

import { Button } from 'flowbite-react'
import {
    UserPlusIcon,
    FireIcon,
    Bars3BottomLeftIcon,
    UserGroupIcon,
    ViewfinderCircleIcon,
    CheckIcon,
} from '@heroicons/react/24/outline'
import CModal from 'common/components/CModal'
import { Dialog } from '@headlessui/react'
import MShareModal from '../components/MShareModal'
import MParticipantsModal from '../components/MParticipantsModal'

const data = {
    id: 1,
    title: 'group1',
    description: 'test',
    role: 'Owner',
}

function MGroup() {
    //#region data
    // const { groupId } = useParams()
    const shareModalRef = useRef()
    const participantsModalRef = useRef()
    // const { data: _data, isLoading } = getById(groupId)
    //#endregion

    //#region event
    //#endregion

    // if (isLoading) return <CLoading />
    return (
        <div className="flex flex-col items-center pt-20">
            <div className="mb-1 w-[52rem] rounded border bg-white p-5">
                <h1 className="text-xl font-semibold">Still waiting for responses</h1>
                <p className="w-[40rem] text-base text-gray-500">
                    If you haven't shared your invite, copy the link or use Doodle to email it to
                    your participants.
                </p>
                <div className="flex justify-end">
                    <Button size="md" onClick={() => shareModalRef.current.open()}>
                        <UserPlusIcon className="mr-2 h-5 w-5" /> Share invite
                    </Button>
                </div>
            </div>
            <div className="w-[52rem] rounded border bg-white p-5">
                <h1 className="mb-10 text-xl font-semibold">{data.title}</h1>
                <div className="">
                    <div className="my-1 flex items-center">
                        <FireIcon className="mr-2 h-5 w-5" />
                        {data.role}
                    </div>
                    <div className="my-1 flex items-center">
                        <Bars3BottomLeftIcon className="mr-2 h-5 w-5" />
                        {data.description}
                    </div>
                    <div className="my-1 flex items-center">
                        <UserGroupIcon className="mr-2 h-5 w-5" />
                        Participants (30)
                        <ViewfinderCircleIcon
                            onClick={() => participantsModalRef.current.open()}
                            className="ml-2 h-6 w-6 cursor-pointer text-blue-500"
                        />
                    </div>
                </div>
            </div>

            <MShareModal ref={shareModalRef} />
            <MParticipantsModal ref={participantsModalRef} />
        </div>
    )
}

export default MGroup
