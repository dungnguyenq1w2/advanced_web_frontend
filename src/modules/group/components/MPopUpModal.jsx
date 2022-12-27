import { forwardRef, useImperativeHandle, useState } from 'react'

import { setOwner } from 'apis/group.api'

import CModal from 'common/components/CModal'

import { ROLE_ASSIGNMENT } from 'common/constant'

function MPopUpModal({ groupId, currentOwnerId, selectedUserId, onRoleChange, refetch }, ref) {
    //#region data
    const [isOpen, setIsOpen] = useState(false)
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
    const handleClose = () => {
        setIsOpen(false)
    }

    const handleSetOwner = async () => {
        try {
            await setOwner(groupId, {
                currentOwnerId: currentOwnerId,
                selectedUserId: selectedUserId,
            })
            onRoleChange(ROLE_ASSIGNMENT.SET_OWNER, selectedUserId)
            onRoleChange(ROLE_ASSIGNMENT.DEMOTE, currentOwnerId)
            await refetch()
            setIsOpen(false)
        } catch (error) {
            setIsOpen(false)
            console.log('Error: ', error)
        }
    }
    //#endregion

    return (
        <CModal title="Set this participant to Owner?" isOpen={isOpen} onClose={handleClose}>
            <div className="h-[210px]">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                    <div className="p-6 text-center">
                        <svg
                            aria-hidden="true"
                            className="mx-auto mb-4 h-10 w-10 text-gray-400 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h4 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            You will be demoted to Co-owner
                        </h4>
                        <button
                            type="button"
                            onClick={handleSetOwner}
                            className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-8 py-2.5 text-center text-lg font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-200 bg-white px-8 py-2.5 text-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </CModal>
    )
}

export default forwardRef(MPopUpModal)
