import { forwardRef, useState, useEffect, useMemo, useRef, useImperativeHandle } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import CModal from 'common/components/CModal'
import { getById } from 'common/queries-fn/groups.query'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Button } from 'flowbite-react'

function MPopUpModal({ curOwnerId, nextOwnerId }, ref) {
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

    // code here
    const handleDelegateOwner = () => {
        console.log('curOwnerId: ', curOwnerId)
        console.log('nextOwnerId: ', nextOwnerId)
    }
    //#endregion

    return (
        <CModal isOpen={isOpen} onClose={handleClose}>
            <Dialog.Panel className="max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                    as="h3"
                    className="px-28 py-4 text-center text-xl font-medium leading-6 text-gray-900"
                >
                    Delegate Owner
                </Dialog.Title>
                <XMarkIcon
                    className="absolute top-2 right-2 h-10 w-10 cursor-pointer text-gray-700"
                    onClick={handleClose}
                />
                <hr />
                <div className="h-[190px]">
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
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <h4 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure?
                            </h4>
                            <button
                                type="button"
                                onClick={handleDelegateOwner}
                                className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                            >
                                Yes, I'm sure
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                            >
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog.Panel>
        </CModal>
    )
}

export default forwardRef(MPopUpModal)
