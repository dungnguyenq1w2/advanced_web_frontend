import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'

import { identify } from 'apis/auth.api'
import { identifyValidationSchema } from '../validation'

import CLoading from 'common/components/CLoading'
import { Button, Label } from 'flowbite-react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const formOptions = { resolver: yupResolver(identifyValidationSchema) }

function MIdentify() {
    // #region data
    const [identifyMessage, setIdentifyMessage] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful, isValid },
        
    } = useForm(formOptions)
    // #endregion

    // #region event
  
    const onSubmit = async (data) => {
        setIsLoading(true)
        const res = await identify(data)

        if (res?.data) {
            setTimeout(() => {
                setIsLoading(false)
                setIdentifyMessage(res?.data.message)
            }, 400)
        } else {
            setIdentifyMessage(res.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 400)
        }
    }

    useEffect(() => {
        setIdentifyMessage('')
    }, [isValid])
    
    // #endregion

    return (
        <div className="flex flex-col items-center pt-40">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex w-[25rem] flex-col gap-4 rounded-lg bg-white p-10 shadow-md"
            >
                <Link to="/">
                    <span className="absolute top-5 left-5 flex cursor-pointer">
                        <ArrowLeftIcon className="mr-2 h-6 w-6" /> Home
                    </span>
                </Link>
                <h1 className="text-center text-xl font-bold">Identify</h1>
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="email"
                            value="Please enter your email to send identification for your account."
                        />
                    </div>
                    <input
                        type="text"
                        name="email"
                        autoFocus
                        {...register('email', { required: true })}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
                    />
                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={() => (

                            <div
                                className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                                role="alert"
                            >
                                <span className="font-medium">{errors.email?.message}</span>
                            </div>
                        )}
                    />
                </div>
                {identifyMessage && (
                    <div
                        className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                        role="alert"
                    >
                        <span className="font-medium">{identifyMessage}</span>
                    </div>
                )}
                {isLoading && <CLoading />}

                <Button type="submit">Send</Button>
            </form>
        </div>
    )
}

export default MIdentify
