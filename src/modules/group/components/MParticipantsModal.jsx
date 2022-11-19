import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { XMarkIcon, ChevronDoubleUpIcon, ChevronDoubleDownIcon } from '@heroicons/react/20/solid'
import { detachedByKey } from '../utils/index'
import { Avatar } from 'flowbite-react'

const MParticipantsModal = forwardRef(({ participants }, ref) => {
    //#region data
    const [isOpen, setIsOpen] = useState(false)
    const [owner, setOwner] = useState(detachedByKey(participants, 1)[0])
    const [co_owners, setCo_owners] = useState(detachedByKey(participants, 2))
    const [members, setMembers] = useState(detachedByKey(participants, 3))
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const user_co_owner = useMemo(() => {
        for (let co_owner of co_owners) if (user.id === co_owner.user.id) return true

        return false
    }, [user])
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

    // code thăng cấp member
    const handlePromoteUser = (id) => {
        console.log(id)
    }

    const handleDepromotedeUser = (id) => {
        console.log(id)
    }

    const handleDeleteUser = (id) => {
        console.log(id)
    }
    //#endregion

    return (
        <CModal isOpen={isOpen} onClose={handleClose}>
            <Dialog.Panel className="max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                    as="h3"
                    className="px-40 py-4 text-center text-xl font-medium leading-6 text-gray-900"
                >
                    Participants
                </Dialog.Title>
                <XMarkIcon
                    className="absolute top-2 right-2 h-10 w-10 cursor-pointer text-gray-700"
                    onClick={handleClose}
                />
                <hr />
                <div className="h-[450px] overflow-auto">
                    <div className="w-full px-3 ">
                        <h5 className="block w-full border-b-2  border-b-black py-2 text-[30px] text-[#38BDF8]">
                            Owner
                        </h5>

                        <div className="flex items-center p-2">
                            <div>
                                <Avatar
                                    alt="User settings"
                                    img={owner?.user?.image}
                                    rounded={true}
                                />
                            </div>
                            <div className="flex-1 pl-3">{owner?.user?.name}</div>
                        </div>
                    </div>
                    <div className="mt-7 w-full px-3">
                        <h5 className="block w-full border-b-2  border-b-black py-2 text-[30px] text-[#38BDF8]">
                            Co-owner
                            <div className="float-right pt-4 text-[18px]">
                                {co_owners.length} Co-owner
                            </div>
                        </h5>
                        {co_owners.map((co_owner, index) => (
                            <div key={index} className="flex items-center p-2">
                                <div>
                                    <Avatar
                                        alt="User settings"
                                        img={co_owner?.user?.image}
                                        rounded={true}
                                    />
                                </div>
                                <div className="flex-1 pl-3">{co_owner?.user?.name}</div>
                                {owner?.user?.id === user.id ? (
                                    <div className="flex">
                                        <ChevronDoubleDownIcon
                                            onClick={() =>
                                                handleDepromotedeUser(co_owner?.user?.id)
                                            }
                                            className="ml-1 h-6 w-6 cursor-pointer text-blue-700"
                                        ></ChevronDoubleDownIcon>
                                        <XMarkIcon
                                            onClick={() => handleDeleteUser(co_owner?.user?.id)}
                                            className="ml-1 h-6 w-6 cursor-pointer text-red-700"
                                        ></XMarkIcon>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-7 w-full px-3">
                        <h5 className="block w-full border-b-2  border-b-black py-2 text-[30px] text-[#38BDF8]">
                            Member
                            <div className="float-right cursor-pointer pt-4 text-[18px]">
                                {members.length} member
                            </div>
                        </h5>
                        {members.map((member, index) => (
                            <div key={index} className="flex cursor-pointer items-center p-2">
                                <div>
                                    <Avatar
                                        alt="User settings"
                                        img={member?.user?.image}
                                        rounded={true}
                                    />
                                </div>
                                <div className="flex-1 pl-3">{member?.user?.name}</div>
                                {owner?.user?.id === user.id ? (
                                    <div className="flex">
                                        <ChevronDoubleUpIcon
                                            onClick={() => handlePromoteUser(member?.user?.id)}
                                            className="mr-1 h-6 w-6 text-blue-700"
                                        ></ChevronDoubleUpIcon>
                                        <ChevronDoubleDownIcon
                                            onClick={() => handleDepromotedeUser(member?.user?.id)}
                                            className="ml-1 h-6 w-6 text-blue-700"
                                        ></ChevronDoubleDownIcon>
                                        <XMarkIcon
                                            onClick={() => handleDeleteUser(member?.user?.id)}
                                            className="ml-1 h-6 w-6 text-red-700"
                                        ></XMarkIcon>
                                    </div>
                                ) : user_co_owner ? (
                                    <div className="flex">
                                        <XMarkIcon
                                            onClick={() => handleDeleteUser(member?.user?.id)}
                                            className="ml-1 h-6 w-6 text-red-700"
                                        ></XMarkIcon>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Dialog.Panel>
        </CModal>
    )
})

export default MParticipantsModal
