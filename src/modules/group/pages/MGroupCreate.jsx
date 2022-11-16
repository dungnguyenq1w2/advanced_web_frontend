import { Dialog, Transition } from '@headlessui/react'
import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { create } from 'apis/group.api'
import CCombobox from 'common/components/CCombobox'
import CLoading from 'common/components/CLoading'
import { Button, Label, Tabs } from 'flowbite-react'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { groupValidationSchema } from '../validation'

const people = [
    { id: 1, name: 'Wade Cooper', email: 'aaaa@gmail.com' },
    { id: 2, name: 'Arlene Mccoy', email: 'Arlene@gmail.com' },
    { id: 3, name: 'Devon Webb', email: 'Devon@gmail.com' },
    { id: 4, name: 'Tom Cook', email: 'wTomade@gmail.com' },
    { id: 5, name: 'Tanya Fox', email: 'Tanya@gmail.com' },
    { id: 6, name: 'Hellen Schmidt', email: 'Hellen@gmail.com' },
]

function MGroupCreate() {
    //#region data
    const [isLoading, setIsLoading] = useState(false)
    const [createdGroupId, setCreatedGroupId] = useState(0)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(groupValidationSchema) })
    //#endregion

    //#region event
    const onSubmit = async (data) => {
        setIsLoading(true)
        const res = await create(data)
        console.log('🚀 ~ res', res)

        if (res?.data) {
            setCreatedGroupId(res.data.data.id)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        } else {
            console.log('🚀 ~ res', res)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
    }

    const closeModal = () => {
        navigate(`/group/${createdGroupId}`)
    }
    //#endregion
    return (
        <div className="flex justify-center pt-20">
            <div className="w-[40rem] rounded border bg-white p-5">
                <h1 className="text-center text-2xl font-semibold">Create a Group</h1>

                <div className="my-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="title" value="Title *" />
                            </div>
                            <input
                                type="title"
                                name="title"
                                {...register('title', { required: true })}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <ErrorMessage
                                errors={errors}
                                name="title"
                                render={() => (
                                    <div
                                        className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                                        role="alert"
                                    >
                                        <span className="font-medium">{errors.title?.message}</span>
                                    </div>
                                )}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <input
                                type="description"
                                name="description"
                                {...register('description', { required: true })}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <ErrorMessage
                                errors={errors}
                                name="description"
                                render={() => (
                                    <div
                                        className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                                        role="alert"
                                    >
                                        <span className="font-medium">
                                            {errors.description?.message}
                                        </span>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="mt-3 flex justify-center">
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </div>
            </div>
            <Transition appear show={!!createdGroupId} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-center text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Create group successful
                                    </Dialog.Title>

                                    <div className="mt-8 text-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {isLoading && <CLoading />}
        </div>
    )
}

export default MGroupCreate
