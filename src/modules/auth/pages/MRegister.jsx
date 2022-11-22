import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'

import { googleLogin, register as accountRegister } from 'apis/auth.api'

import CLoading from 'common/components/CLoading'

import { Button, Label } from 'flowbite-react'
import { registerValidationSchema } from '../validation'
import google from 'assets/images/google.png'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import GoogleLogin from 'react-google-login'
import { refreshTokenSetup } from 'utils/refreshTokenSetup'

const formOptions = { resolver: yupResolver(registerValidationSchema) }

function MRegister() {
    //#region Data
    const [registerError, setRegisterError] = useState()
    const [isSuccess, setIsSuccess] = useState(false)
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
        setIsLoading(true)
        const resRegister = await accountRegister(data)

        if (resRegister.data) {
            setIsSuccess(true)
            // alert('Đăng kí thành công!! Cần xác thực tài khoản để đăng nhập')
            // const accountLogin = {
            //     email: data.email,
            //     password: data.password,
            // }
            // const resLogin = await login(accountLogin)
            // if (resLogin?.data) {
            //     setTimeout(() => {
            //         setIsLoading(false)
            //     }, 600)
            //     navigate(-1)
            //     setTimeout(() => {
            //         navigate(0)
            //     }, 300)
            // } else {
            //     setRegisterError(resLogin.error.message)
            //     setTimeout(() => {
            //         setIsLoading(false)
            //     }, 600)
            // }
        } else {
            setRegisterError(resRegister.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
    }

    const onGoogleLoginSuccess = async (res) => {
        console.log('LOGIN SUCCESS --> res:', res)

        setIsLoading(true)
        const result = await googleLogin({
            token: res?.tokenId,
        })

        if (result?.data) {
            // navigate(-1)
            setTimeout(() => {
                // navigate(0)
                navigate('/')
            }, 300)
        } else {
            setRegisterError(result.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
        // try {
        //     setIsLoading(true)
        //     const result = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google-login`, {
        //         token: res?.tokenId,
        //     })

        //     // setUser(result.data.user)
        //     console.log(result)
        //     console.log(result.data.user)
        //     // localStorage.setItem('user', JSON.stringify(result.data.user))
        //     // navigate(-1)
        //     // setTimeout(() => {
        //     //     navigate(0)
        //     // }, 300)
        //     if (result?.data) {
        //         localStorage.setItem('user', JSON.stringify({ ...result.data }))

        //         localStorage.setItem('is_google_login', true)
        //         navigate(-1)
        //         setTimeout(() => {
        //             navigate(0)
        //         }, 300)
        //     } else {
        //         setLoginError(result.error.message)
        //         console.log('🚀 ~ result', result)
        //         setTimeout(() => {
        //             setIsLoading(false)
        //         }, 600)
        //     }
        // } catch (err) {
        //     console.log(err)
        // }

        refreshTokenSetup(res)
    }
    const onGoogleLoginError = (res) => {
        console.log('LOGIN FAILED --> res:', res)
    }
    //#endregion
    return (
        <div className="flex flex-col items-center pt-16">
            {!isSuccess ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="relative flex w-[25rem] flex-col gap-4 rounded-lg bg-white p-10 shadow-md"
                >
                    <Link to="/">
                        <span className="absolute top-5 left-5 flex cursor-pointer">
                            <ArrowLeftIcon className="mr-2 h-6 w-6" /> Home{' '}
                        </span>
                    </Link>

                    <h1 className="text-center text-xl font-bold">REGISTER</h1>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name" value="Your name" />
                        </div>
                        <input
                            autoFocus
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
                    {/* <div className="mx-auto text-sm text-gray-500">
                    <Link to="/auth/login">
                        <span className="hover:text-gray-800">Login</span>
                    </Link>
                </div> */}
                    <div className="mt-3 flex cursor-pointer flex-col items-center">
                        <h3 className="text-sm text-gray-500"> Or</h3>
                        <div className="mt-2 flex">
                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                buttonText="Continue with Google"
                                // text="Log in with Google"
                                onSuccess={onGoogleLoginSuccess}
                                onFailure={onGoogleLoginError}
                                // onError={onGoogleLoginError}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </form>
            ) : (
                <div className="relative flex w-[25rem] flex-col gap-4 rounded-lg bg-white p-10 shadow-md">
                    <Link to="/">
                        <span className="absolute top-5 left-5 flex cursor-pointer">
                            <ArrowLeftIcon className="mr-2 h-6 w-6" /> Home
                        </span>
                    </Link>
                    <h1 className="text-center text-xl font-bold">REGISTER</h1>
                    <div className="text-center text-lg font-semibold">
                        <p className="text-green-400">Đăng kí thành công!!!</p>
                        <p>Cần xác thực tài khoản</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MRegister
