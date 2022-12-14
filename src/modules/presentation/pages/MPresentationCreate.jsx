import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'

import { add as addSlide } from 'apis/slide.api'
import { postAddPresentation } from 'apis/presentation.api'

import CLoading from 'common/components/CLoading'
import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { Button, Label } from 'flowbite-react'
import { presentationValidationSchema } from '../validation'

function MPresentationCreate() {
    //#region data
    const [isLoading, setIsLoading] = useState(false)
    const [PresentationId, setPresentationId] = useState(0)
    const [sildeId, setSildeId] = useState(0)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(presentationValidationSchema) })
    const user = JSON.parse(localStorage.getItem('user'))
    //#endregion

    //#region event
    useEffect(() => {
        if (!user) {
            alert('Login to use this feature')
            navigate('/auth/login')
        }
    }, [])

    const handleAddSlide = async (presentationId) => {
        try {
            const res = await addSlide({
                question: 'Question',
                presentation_id: presentationId,
            })

            if (res?.data) setSildeId(res?.data?.id)
        } catch (error) {
            console.log('Error', error)
        }
    }

    const onSubmit = async (data) => {
        data.hostId = user?.id
        setIsLoading(true)
        const res = await postAddPresentation(data)

        if (res?.data) {
            await handleAddSlide(res?.data?.id)
            setPresentationId(res?.data?.id)
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
        navigate(`/presentation/${PresentationId}/${sildeId}/edit`)
    }
    //#endregion

    return (
        <div className="flex justify-center pt-20">
            <div className="w-[40rem] rounded border bg-white p-5">
                <h1 className="text-center text-2xl font-semibold">Create a Presentation</h1>

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
                                autoFocus
                                required
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
                        <div className="mt-3 flex justify-center">
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </div>
            </div>

            <CModal isOpen={!!PresentationId} onClose={closeModal}>
                <Dialog.Panel className="max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-center text-lg font-medium leading-6 text-gray-900"
                    >
                        Create presentation successful
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

export default MPresentationCreate
