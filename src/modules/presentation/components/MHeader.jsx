import { useState, useEffect, useCallback } from 'react'
import { PlayIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'
import { add as addSlide } from 'apis/slide.api'
import {
    getPresentationById,
    updatePresentationName,
    postCreatePresentationCode
} from 'apis/presentation.api'
import { useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/20/solid'
import _debounce from 'lodash/debounce'

function MHeader({ presentationId, refetchSlides }) {
    //#region data
    const navigate = useNavigate()
    const [presentation, setPresentation] = useState({})
    const [isLoadingUpdateName, setIsLoadingUpdateName] = useState('none')
    const debounceFn = useCallback(_debounce(handleUpdatePresentation, 1000), [presentation?.name])
    //#endregion

    //#region event
    const getPresentation = async () => {
        const res = await getPresentationById(presentationId)
        if (res?.data) setPresentation(res?.data)
    }
    useEffect(() => {
        getPresentation()
    }, [])

    async function handleUpdatePresentation(data) {
        try {
            setIsLoadingUpdateName('loading')
            const res = await updatePresentationName(data)

            if (res?.data) {
                setPresentation({ ...presentation, name: res?.data })
                setTimeout(() => {
                    setIsLoadingUpdateName('save')
                }, 600)
            } else {
                setTimeout(() => {
                    setIsLoadingUpdateName('fail')
                }, 600)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleResetNumberCode = async () => {
        try {
            const res = await postCreatePresentationCode(presentation?.id)
            if (res?.data) 
                setPresentation({ ...presentation, code: res?.data })
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddSlide = async () => {
        try {
            const res = await addSlide({
                question: '',
                presentation_id: presentationId,
            })

            if (res?.data) {
                await refetchSlides()
                navigate(`/presentation/${presentationId}/${res?.data?.id}/edit`)
            }
        } catch (error) {
            console.log('Error', error)
        }
    }
    //#endregion

    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-none flex-row">
                <div className="ml-6 mr-3 flex flex-row rounded-lg border border-gray-300 bg-gray-50">
                    <input
                        type="text"
                        id="code"
                        className="block w-40 rounded-lg border-none bg-transparent p-2 text-center text-lg font-normal text-gray-700 focus:border-none focus:ring-transparent"
                        placeholder="Name presentation"
                        value={presentation?.name || ' '}
                        onChange={(e) => {
                            if (e.target.value != '' && e.target.value != presentation.name) {
                                setPresentation({ ...presentation, name: e.target.value })
                                debounceFn({ name: e.target.value, presentationId: presentationId })
                            }
                        }}
                        required
                    />
                    {isLoadingUpdateName === 'none' ? (
                        <></>
                    ) : isLoadingUpdateName === 'save' ? (
                        <CheckIcon className="my-2.5 mx-2 h-7 w-8 cursor-pointer text-blue-600" />
                    ) : isLoadingUpdateName === 'fail' ? (
                        <XMarkIcon className="my-2.5 mx-2 h-7 w-8 cursor-pointer text-blue-600" />
                    ) : (
                        <div className="flex items-center text-center">
                            <div role="status">
                                <svg
                                    className="mr-2 inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="mr-22 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
                    onClick={handleAddSlide}
                >
                    + Add Slide
                </button>
            </div>

            <div className="flex w-96 flex-1 shrink flex-row justify-center">
                <b className="py-2">Number code: </b>
                <div className="ml-3 flex-none">
                    <input
                        type="text"
                        id="code"
                        className="block w-40 rounded-lg border border-gray-300 bg-gray-50 p-2 text-center text-lg font-extrabold text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        value={presentation?.code || ' '}
                        required
                        readOnly
                    />
                </div>
                <ArrowPathIcon
                    className="mx-2 my-1 h-8 w-8 cursor-pointer text-blue-600"
                    onClick={handleResetNumberCode}
                />
            </div>

            <button
                className="mr-28 flex w-full items-center rounded-lg bg-blue-700 px-5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
                onClick={() => navigate(`/presentation-slide/${presentationId}/host`)}
            >
                <PlayIcon className="h-6 w-6 cursor-pointer pr-1.5 text-cyan-400" />
                <h3> Present</h3>
            </button>
        </div>
    )
}

export default MHeader
