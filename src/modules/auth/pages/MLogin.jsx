import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'

import { googleLogin, login } from 'apis/auth.api'
import { loginValidationSchema } from '../validation'

import { Button, Label } from 'flowbite-react'
import CLoading from 'common/components/CLoading'
// import { GoogleLogin } from '@react-oauth/google'
import { gapi } from 'gapi-script'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const formOptions = { resolver: yupResolver(loginValidationSchema) }

function MLogin() {
    // #region data
    const [loginError, setLoginError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    // #endregion

    // #region event
    useEffect(() => {
        const handleGoogleLoginCallback = async (response) => {
            setIsLoading(true)
            const result = await googleLogin({
                token: response?.credential,
            })

            if (result?.data) {
                setTimeout(() => {
                    setIsLoading(false)
                    navigate(-1)
                }, 600)
            } else {
                setLoginError(result.error.message)
                setTimeout(() => {
                    setIsLoading(false)
                }, 600)
            }
        }

        // /* global google */
        if (window.google) {
            const google = window.google
            google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleGoogleLoginCallback,
            })

            google.accounts.id.renderButton(document.getElementById('google-login'), {
                shape: 'pill',
                theme: 'outline',
                text: 'continue_with',
                size: 'medium',
                locale: 'en-US',
            })

            google.accounts.id.prompt()
        }
        if (localStorage.getItem('user')) navigate('/')
    }, [navigate])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions)

    const onSubmit = async (data) => {
        setIsLoading(true)
        const res = await login(data)

        if (res?.data) {
            setTimeout(() => {
                setIsLoading(false)
                navigate(-1)
            }, 600)
        } else {
            setLoginError(res.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
    }

    const onGoogleLoginSuccess = async (res) => {
        setIsLoading(true)
        const result = await googleLogin({
            token: res?.tokenId,
        })

        if (result?.data) {
            setTimeout(() => {
                setIsLoading(false)
                navigate(-1)
            }, 600)
        } else {
            setLoginError(result.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
    }
    const onGoogleLoginError = (res) => {
        console.log('LOGIN FAILED --> res:', res)
    }
    // #endregion

    return (
        <div className="flex flex-col items-center pt-16">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex w-[25rem] flex-col gap-4 rounded-lg bg-white p-10 shadow-md"
            >
                <Link to="/">
                    <span className="absolute top-5 left-5 flex cursor-pointer">
                        <ArrowLeftIcon className="mr-2 h-6 w-6" /> Home
                    </span>
                </Link>
                <h1 className="text-center text-xl font-bold">LOGIN</h1>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email" value="Your email" />
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
                {loginError && (
                    <div
                        className="mt-1 rounded-lg bg-red-100 p-2 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
                        role="alert"
                    >
                        <span className="font-medium">{loginError}</span>
                    </div>
                )}
                {isLoading && <CLoading />}

                <Button type="submit">Submit</Button>

                <div className="mx-auto text-sm text-gray-500">
                    <span className="cursor-pointer hover:text-gray-800">Forget password</span> /{' '}
                    <Link to="/auth/register">
                        <span className="hover:text-gray-800">Register</span>
                    </Link>
                </div>
                <div className="mt-3 flex flex-col items-center">
                    <h3 className="text-sm text-gray-500"> Or</h3>
                    <div className="mt-2 flex">
                        {/* <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText="Continue with Google"
                            // text="Log in with Google"
                            onSuccess={onGoogleLoginSuccess}
                            onFailure={onGoogleLoginError}
                            // onError={onGoogleLoginError}
                            cookiePolicy={'single_host_origin'}
                        /> */}
                        <div id="google-login"></div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default MLogin
