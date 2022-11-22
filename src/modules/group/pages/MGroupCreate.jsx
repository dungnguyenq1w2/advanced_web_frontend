import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'

import { create } from 'apis/group.api'
import CLoading from 'common/components/CLoading'

import { Dialog } from '@headlessui/react'
import CModal from 'common/components/CModal'
import { Button, Label } from 'flowbite-react'
import { groupValidationSchema } from '../validation'

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
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) {
            alert('Login to use this feature')
            navigate('/auth/login')
        }
    }, [])

    const onSubmit = async (data) => {
        setIsLoading(true)
        const res = await create(data)

        if (res?.data) {
            setCreatedGroupId(res.data.data.id)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        } else {
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
                                <Label htmlFor="name" value="Name *" />
                            </div>
                            <input
                                type="name"
                                name="name"
                                {...register('name', { required: true })}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <ErrorMessage
                                errors={errors}
                                name="name"
                                render={() => (
                                    <div
                                        className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                                        role="alert"
                                    >
                                        <span className="font-medium">{errors.name?.message}</span>
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

            <CModal isOpen={!!createdGroupId} onClose={closeModal}>
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
            </CModal>

            {isLoading && <CLoading />}
        </div>
    )
}

export default MGroupCreate
