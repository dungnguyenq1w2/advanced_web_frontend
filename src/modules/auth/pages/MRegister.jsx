import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'

import { login, register as accountRegister } from 'apis/auth.api'

import CLoading from 'common/components/CLoading'

import { Button, Label } from 'flowbite-react'
import { registerValidationSchema } from '../validation'
import google from 'assets/images/google.png'

const formOptions = { resolver: yupResolver(registerValidationSchema) }

function MRegister() {
    //#region Data
    const [registerError, setRegisterError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions)
    //#endregion

    //#region event
    useEffect(() => {
        if (localStorage.getItem('user')) navigate('/')
    }, [])

    const onSubmit = async (data) => {
        console.log('🚀 ~ data', data)
        setIsLoading(true)
        const resRegister = await accountRegister(data)

        if (resRegister.data) {
            const accountLogin = {
                email: data.email,
                password: data.password,
            }
            const resLogin = await login(accountLogin)
            if (resLogin?.data) {
                setTimeout(() => {
                    setIsLoading(false)
                }, 600)
                navigate(-1)
                setTimeout(() => {
                    navigate(0)
                }, 300)
            } else {
                setRegisterError(resLogin.error.message)
                setTimeout(() => {
                    setIsLoading(false)
                }, 600)
            }
        } else {
            setRegisterError(resRegister.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
    }

    const handleGoogleLogin = () => {
        // Xử lí đăng nhập bằng Google
    }
    //#endregion
    return (
        <div className="flex flex-col items-center pt-16">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-[25rem] flex-col gap-4 rounded-lg bg-white p-10 shadow-md"
            >
                <h1 className="text-center text-xl font-bold">REGISTER</h1>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="Your name" />
                    </div>
                    <input
                        type="text"
                        name="name"
                        {...register('name', { required: true })}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
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
                        <Label htmlFor="email" value="Your email" />
                    </div>
                    <input
                        type="text"
                        name="email"
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
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password" value="Your password" />
                    </div>
                    <input
                        type="password"
                        name="password"
                        {...register('password', { required: true })}
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
                        <Label htmlFor="confirmPassword" value="Confirm password" />
                    </div>
                    <input
                        type="password"
                        name="confirmPassword"
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
                                <span className="font-medium">
                                    {errors.confirmPassword?.message}
                                </span>
                            </div>
                        )}
                    />
                </div>

                {registerError && (
                    <div
                        className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                        role="alert"
                    >
                        <span className="font-medium">{registerError}</span>
                    </div>
                )}
                {isLoading && <CLoading />}

                <Button type="submit">Register</Button>
                <div className="mx-auto text-sm text-gray-500">
                    <Link to="/auth/login">
                        <span className="hover:text-gray-800">Login</span>
                    </Link>
                </div>
                <div className="mt-3 flex flex-col items-center">
                    <h3 className="text-sm text-gray-500"> Or Register with</h3>
                    <div className="mt-2 flex">
                        <img
                            className="h-8 w-8 cursor-pointer"
                            src={google}
                            alt="Google icon"
                            onClick={handleGoogleLogin}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default MRegister
