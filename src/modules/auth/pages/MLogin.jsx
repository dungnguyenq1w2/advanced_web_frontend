import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'

import { login } from 'apis/auth.api'
import { loginValidationSchema } from '../validation'

import { Button, Label } from 'flowbite-react'
import CLoading from 'common/components/CLoading'
import { refreshTokenSetup } from '../../../utils/refreshTokenSetup'
// import { GoogleLogin } from '@react-oauth/google'
import { GoogleLogin } from 'react-google-login'
import { gapi } from 'gapi-script'
import axios from 'axios'
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
        // gapi.load('client:auth2', () => {
        //     // gapi.client.init({
        //     gapi.auth2.getAuthInstance({
        //         client_id:
        //             '433396208748-b93bnrb74g5tgenlrpmhii397a5hp8b7.apps.googleusercontent.com',
        //         // plugin_name: 'chat',
        //         scope: '',
        //     })
        // })
        if (localStorage.getItem('user')) navigate('/')
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions)

    const onSubmit = async (data) => {
        setIsLoading(true)
        const res = await login(data)

        if (res?.data) {
            navigate(-1)
            setTimeout(() => {
                navigate(0)
            }, 300)
        } else {
            setLoginError(res.error.message)
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
    }

    // const handleGoogleLogin = () => {
    //     // Xử lí đăng nhập bằng Google
    // }
    const onGoogleLoginSuccess = async (res) => {
        console.log('LOGIN SUCCESS --> res:', res)
        try {
            const result = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google-login`, {
                token: res?.tokenId,
            })

            // setUser(result.data.user)
            console.log(result)
            console.log(result.data.user)
            // localStorage.setItem('user', JSON.stringify(result.data.user))
            // navigate(-1)
            // setTimeout(() => {
            //     navigate(0)
            // }, 300)
            if (result?.data) {
                localStorage.setItem('user', JSON.stringify(result.data.user))
                navigate(-1)
                setTimeout(() => {
                    navigate(0)
                }, 300)
            } else {
                setLoginError(result.error.message)
                console.log('🚀 ~ res', res)
                setTimeout(() => {
                    setIsLoading(false)
                }, 600)
            }
        } catch (err) {
            console.log(err)
        }
        refreshTokenSetup(res)
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
                    <h3 className="text-sm text-gray-500"> Or Login with</h3>
                    <div className="mt-2 flex">
                        {/* <img
                            className="h-8 w-8 cursor-pointer"
                            src={google}
                            alt="Google icon"
                            onClick={handleGoogleLogin}
                        /> */}

                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText="Log in with Google"
                            // text="Log in with Google"
                            onSuccess={onGoogleLoginSuccess}
                            onFailure={onGoogleLoginError}
                            // onError={onGoogleLoginError}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default MLogin
