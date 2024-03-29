import { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'

import { verify } from 'apis/auth.api'
import { Button, Card, Spinner } from 'flowbite-react'

function MVerify() {
    // #region data
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isError404, setIsError404] = useState(false)
    const navigate = useNavigate()
    // #endregion

    // #region event
    useEffect(() => {
        const restApi = async () => {
            setIsLoading(true)
            const res = await verify({
                email: searchParams.get('email'),
                token: searchParams.get('token'),
            })

            if (res?.error?.status === 404) {
                setIsFirst(false)
                setIsError404(true)
                //navigate('/')
            }

            if (res?.data?.id) {
                setIsFirst(false)
                setIsLoading(false)
                setTimeout(() => {
                    navigate('/')
                    setTimeout(() => {
                        navigate(0)
                    }, 200)
                }, 3000)
            } else setErrorMessage(res.error?.message)
        }
        restApi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleButton = () => {
        navigate('/')
        setTimeout(() => {
            navigate(0)
        }, 200)
    }
    //#endregion
    return (
        <>
            {isError404 ? (
                <section className="flex h-full items-center p-16 dark:bg-gray-900 dark:text-gray-100">
                    <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
                        <div className="max-w-md text-center">
                            <h2 className="mb-8 text-9xl font-extrabold dark:text-gray-600">
                                <span className="sr-only">Error</span>404
                            </h2>
                            <p className="text-2xl font-semibold md:text-3xl">
                                Sorry, we couldn't find this page.
                            </p>
                            <p className="mt-4 mb-8 dark:text-gray-400">
                                But dont worry, you can find plenty of other things on our homepage.
                            </p>
                            <a
                                rel="noopener noreferrer"
                                href="/#"
                                className="rounded px-8 py-3 font-semibold dark:bg-violet-400 dark:text-gray-900"
                                onClick={() => {
                                    navigate('/')
                                }}
                            >
                                Back to homepage
                            </a>
                        </div>
                    </div>
                </section>
            ) : isFirst ? (
                <></>
            ) : (
                <div className="flex flex-col items-center p-8">
                    <Card className="h-80 w-80 rounded-lg bg-white">
                        <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {isLoading ? 'Confirming... ' : 'Auth completed!'}
                        </h5>
                        {isLoading ? (
                            <div className="flex justify-center">
                                <Spinner aria-label="Extra small spinner example" size="xl" />
                            </div>
                        ) : errorMessage ? (
                            <h2 className="text-red-800">{errorMessage}</h2>
                        ) : (
                            <Button onClick={handleButton}>
                                Home
                                <svg
                                    className="ml-2 -mr-1 h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Button>
                        )}
                    </Card>
                </div>
            )}
        </>
    )
}

export default MVerify
