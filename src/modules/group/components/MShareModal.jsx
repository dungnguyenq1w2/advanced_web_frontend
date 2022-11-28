import { forwardRef, useImperativeHandle, useState } from 'react'

import { useParams } from 'react-router-dom'

import CLoading from 'common/components/CLoading'
import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { sendInvitationByEmail } from 'apis/group.api'

import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Button } from 'flowbite-react'
import { v4 as uuidv4 } from 'uuid'
import { emailVailation } from '../validation'

const MShareModal = forwardRef(({}, ref) => {
    //#region data
    const { groupId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [email, setEmail] = useState('')
    const [emails, setEmails] = useState([])
    const [emailError, setEmailError] = useState()
    const [isSuccess, setIsSuccess] = useState(false)
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

    const handleAddEmail = (e) => {
        if (e.key === 'Enter') {
            emailVailation
                .validate({ email })
                .then((value) => {
                    if (email) {
                        setEmails([...emails, { id: uuidv4(), email }])
                        setEmail('')
                        setEmailError('')
                    }
                })
                .catch((error) => setEmailError(error.errors[0]))
        }
    }

    const handleRemoveEmail = (emailId) => {
        const index = emails.findIndex((e) => e.id === emailId)
        const newEmails = [...emails]
        newEmails.splice(index, 1)
        setEmails(newEmails)
    }

    const handleSendEmail = async () => {
        setIsLoading(true)
        const res = await sendInvitationByEmail(groupId, { emails })
        if (res?.data) {
            setIsSuccess(res?.data?.message)
            setIsLoading(false)
        }
    }

    const handleCopyShareLink = () => {
        navigator.clipboard.writeText(`${window.location.href}/invite`)
        setIsCopied(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        setTimeout(() => {
            setIsCopied(false)
        }, 300)
    }

    const closeModal = () => {
        setIsSuccess(false)
        setEmails([])
    }
    //#endregion

    return (
        <>
            <CModal isOpen={isOpen} onClose={handleClose}>
                <Dialog.Panel className="max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="px-8 py-4 text-center text-xl font-medium leading-6 text-gray-900"
                    >
                        Share invite
                    </Dialog.Title>
                    <XMarkIcon
                        className="absolute top-2 right-2 h-10 w-10 cursor-pointer text-gray-700"
                        onClick={handleClose}
                    />
                    <hr />
                    <div className="p-4 text-center">
                        <div className="text-left">
                            <span className="text-sm font-semibold">Share with the link</span>
                            <div className="mb-4 flex items-center">
                                <span className="mr-2 w-80 overflow-hidden truncate text-ellipsis border p-2 text-sm text-gray-400">
                                    {window.location.href}/invite
                                </span>
                                {isCopied ? (
                                    <CheckIcon className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Button onClick={handleCopyShareLink}>Copy link</Button>
                                )}
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold">Invite with email</p>
                            <label
                                htmlFor="emails"
                                className={`block p-2 ${
                                    emailError ? 'border border-red-500' : 'border'
                                }`}
                            >
                                <div className="flex flex-wrap">
                                    {emails.map((e) => (
                                        <span
                                            key={e.id}
                                            className="align-center ease mb-2 mr-1 inline-flex w-max rounded-full bg-blue-100 py-2 pl-4 pr-2 text-xs font-medium text-gray-600 transition duration-300"
                                        >
                                            {e.email}
                                            <XMarkIcon
                                                onClick={() => handleRemoveEmail(e.id)}
                                                className="ml-1 h-4 w-4 cursor-pointer"
                                            />
                                        </span>
                                    ))}
                                </div>

                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleAddEmail}
                                    className="m-0 w-80 border-none p-0 text-sm text-gray-700 focus:border-none focus:border-transparent focus:outline-0 focus:ring-0 focus:ring-transparent"
                                />
                            </label>
                            {emailError && (
                                <span className="text-sm text-red-500">{emailError}</span>
                            )}
                            <div className="mt-2 flex justify-between">
                                <span className=" w-60 items-center text-xs text-gray-600">
                                    We'll need at least one email address to send your invite
                                </span>
                                <Button onClick={handleSendEmail} disabled={!emails.length}>
                                    Send email
                                </Button>
                            </div>
                            {isLoading && <CLoading />}
                        </div>
                    </div>
                </Dialog.Panel>
            </CModal>
            <CModal isOpen={!!isSuccess} onClose={closeModal}>
                <Dialog.Panel className="max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-center text-lg font-medium leading-6 text-gray-900"
                    >
                        {isSuccess}
                    </Dialog.Title>

                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </Dialog.Panel>
            </CModal>
        </>
    )
})

export default MShareModal
