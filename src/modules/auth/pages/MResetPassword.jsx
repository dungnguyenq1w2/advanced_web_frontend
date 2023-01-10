import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { resetPasswordValidationSchema } from '../validation'

import { resetPassword } from 'apis/auth.api'

import CLoading from 'common/components/CLoading'

import { Button, Label } from 'flowbite-react'
import { isSuccess } from 'utils/func'

const formOptions = { resolver: yupResolver(resetPasswordValidationSchema) }

function MResetPassword() {
    // #region data
    const [searchParams, setSearchParams] = useSearchParams()
    const [resetPasswordError, setResetPasswordError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions)
    // #endregion

    // #region event
    const onSubmit = async (data) => {
        data.token = searchParams.get('token')

        setIsLoading(true)
        const res = await resetPassword(data)

        if (res?.data) {
            localStorage.removeItem('user')
            setTimeout(() => {
                setIsLoading(false)
                localStorage.setItem('flagResetPassword', 'true')
                alert('Reset password success! Please login again')
                navigate('/auth/login')
            }, 400)
        } else {
            setResetPasswordError(res.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 400)
        }
    }
    // #endregion

    return (
        <div className="flex flex-col items-center pt-36">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex w-[25rem] flex-col gap-4 rounded-lg bg-white p-10 shadow-md"
            >
                <h1 className="text-center text-xl font-bold">Reset password</h1>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password" value="New password" />
                    </div>
                    <input
                        type="password"
                        name="newPassword"
                        autoFocus
                        placeholder="Input new password"
                        {...register('newPassword', { required: true })}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="password"
                        render={() => (
                            <div
                                className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                                role="alert"
                            >
                                <span className="font-medium">{errors.password?.message}</span>
                            </div>
                        )}
                    />
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password" value="Confirm password" />
                    </div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Input confirm password"
                        {...register('confirmPassword', { required: true })}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="confirmPassword"
                        render={() => (
                            <div
                                className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                                role="alert"
                            >
                                <span className="font-medium">{errors.password?.message}</span>
                            </div>
                        )}
                    />
                </div>

                {resetPasswordError && (
                    <div
                        className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                        role="alert"
                    >
                        <span className="font-medium">{resetPasswordError}</span>
                    </div>
                )}
                {isLoading && <CLoading />}

                <Button type="submit" >Submit</Button>
            </form>
        </div>
    )
}

export default MResetPassword
