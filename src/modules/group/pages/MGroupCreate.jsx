import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import CCombobox from 'common/components/CCombobox'
import { Button, Label, Tabs } from 'flowbite-react'
import React from 'react'
import { useForm } from 'react-hook-form'
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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(groupValidationSchema) })
    //#endregion

    //#region event
    const onSubmit = (data) => {
        console.log('🚀 ~ data', data)
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
        </div>
    )
}

export default MGroupCreate
