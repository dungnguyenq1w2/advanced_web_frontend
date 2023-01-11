import 'react-toastify/dist/ReactToastify.css'

import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { toast, ToastContainer } from 'react-toastify'

import { presentationSocket, SocketContext } from 'common/socket'

import CChatboxModal from 'common/components/CChatbox/CChatboxModal'
import CQuestionModal from 'common/components/CQuestion/CQuestionModal'

import {
    ChatBubbleBottomCenterTextIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'

function MSlide({
    children,
    type,
    code,
    presentationGroupId,
    presentationId,
    slidesId,
    slideIndex,
    onChangeSlide,
}) {
    //#region Data
    const [isCopied, setIsCopied] = useState(false)

    const [isChatboxModalOpen, setIsChatboxModalOpen] = useState(false)
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
    const [notiMessage, setNotiMessage] = useState(null)
    const [notiQuestion, setNotiQuestion] = useState(null)
    const [presentingPresentationGroupId, setPresentingPresentationGroupId] = useState(null)

    const notificationSocket = useContext(SocketContext)
    const navigate = useNavigate()

    const notify = (content) =>
        toast(content, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            onClick: () =>
                content.includes('message')
                    ? setIsChatboxModalOpen(true)
                    : setIsQuestionModalOpen(true),
        })
    //#endregion

    //#region Event
    useEffect(() => {
        if (presentationId) {
            notificationSocket.emit('subscribe-presentation', presentationId)
        }

        // return () => {
        //     if (!presentationId) {
        //         notificationSocket.emit('unsubscribe-presentation', presentationId)
        //     }
        // }
    }, [notificationSocket, presentationId])

    useEffect(() => {
        notificationSocket.on('server-send-message-noti', (noti) => {
            setNotiMessage(noti)
        })
        notificationSocket.on('server-send-question-noti', (noti) => {
            setNotiQuestion(noti)
        })

        presentationSocket.open()
        presentationSocket.on('server-forceStop-presentation', (_presentingPresentationGroupId) => {
            setPresentingPresentationGroupId(_presentingPresentationGroupId)
        })

        return () => {
            notificationSocket.off('server-send-message-noti')
            notificationSocket.off('server-send-question-noti')
            presentationSocket.off('server-forceStop-presentation')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (parseInt(presentingPresentationGroupId) === parseInt(presentationGroupId)) {
            alert('This presentation will be stopped because another presentation is presenting!')
            navigate(-1)
        }
    }, [navigate, presentationGroupId, presentingPresentationGroupId])

    useEffect(() => {
        if (isChatboxModalOpen === false && notiMessage) {
            notify(notiMessage.content)
        }
        setNotiMessage(null)
    }, [notiMessage, isChatboxModalOpen])

    useEffect(() => {
        if (isQuestionModalOpen === false && notiQuestion) {
            notify(notiQuestion.content)
        }
        setNotiQuestion(null)
    }, [notiQuestion, isQuestionModalOpen])

    const handleSlideChange = (type) => () => {
        if (type === 'PREV') {
            onChangeSlide({
                ...slideIndex,
                cur: slideIndex.prev,
                prev: slideIndex.prev - 1,
                next: slideIndex.next - 1,
            })
        }
        if (type === 'NEXT') {
            onChangeSlide({
                ...slideIndex,
                cur: slideIndex.next,
                prev: slideIndex.prev + 1,
                next: slideIndex.next + 1,
            })
        }
    }

    const handleCopyShareLink = async () => {
        navigator.clipboard.writeText(
            `${window.location.host}/presentation-slide/${presentationId}/member${
                presentationGroupId ? `?id=${presentationGroupId}` : ''
            }`
        )
        setIsCopied(true)
    }
    //#endregion
    return (
        <div
            className="relative mx-20 h-full min-w-[1700px] animate-[show-slow_0.25s_ease-in] bg-cover bg-center bg-no-repeat text-white before:absolute before:top-0 before:h-screen before:w-full before:bg-black before:bg-opacity-40"
            style={{
                backgroundImage:
                    type === 1
                        ? 'url(https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80)'
                        : type === 2
                        ? 'url(https://images.unsplash.com/photo-1510936111840-65e151ad71bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1490&q=80)'
                        : 'url(https://images.unsplash.com/photo-1530305408560-82d13781b33a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80)',
            }}
        >
            <div className="absolute top-0 left-0 z-10 flex w-full flex-col items-center">
                <div className="w-full bg-gray-900 bg-opacity-20">
                    <h1 className="peer p-2 text-center text-2xl font-semibold">
                        Go to {window.location.host} and use the code{' '}
                        <span className="text-3xl">{code}</span>
                    </h1>
                    <div className="hidden p-2 pb-4 text-center hover:flex hover:items-center hover:justify-center peer-hover:flex peer-hover:items-center peer-hover:justify-center">
                        <span className="mr-2 border border-gray-700 p-1 text-center text-sm font-normal">
                            {`${window.location.host}/presentation-slide/${presentationId}/member${
                                presentationGroupId ? `?id=${presentationGroupId}` : ''
                            }`}
                        </span>
                        <button
                            className="border border-gray-500 p-1 text-sm font-medium hover:border-black hover:bg-black"
                            onClick={handleCopyShareLink}
                        >
                            {isCopied ? <CheckIcon className="h-5 w-5 text-white" /> : 'Copy link'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative h-full">
                {children}

                {/* Button previous slide */}
                <button
                    className={`absolute top-[45%] left-5 rounded-full bg-gray-500 bg-opacity-40 p-2 ${
                        !slidesId[slideIndex.prev] && 'opacity-20'
                    }`}
                    onClick={handleSlideChange('PREV')}
                    disabled={!slidesId[slideIndex.prev]}
                >
                    <ChevronLeftIcon className="h-10 w-10" />
                </button>

                {/* Button next slide */}
                <button
                    className={`absolute top-[45%] right-5 rounded-full bg-gray-500 bg-opacity-40 p-2 ${
                        !slidesId[slideIndex.next] && 'opacity-20'
                    }`}
                    onClick={handleSlideChange('NEXT')}
                    disabled={!slidesId[slideIndex.next]}
                >
                    <ChevronRightIcon className="h-10 w-10" />
                </button>

                {/* Button Chatbox*/}
                <button
                    className={`absolute bottom-44 right-10 rounded-full bg-gray-500 bg-opacity-40 p-2`}
                    onClick={() => {
                        setIsChatboxModalOpen(true)
                    }}
                >
                    <div className="relative">
                        <ChatBubbleBottomCenterTextIcon className="h-8 w-8" />
                        {/* <span className="absolute -top-2 -right-2 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                        </span> */}
                    </div>
                </button>

                {/* Button Question slide */}
                <button
                    className="absolute bottom-28 right-10 rounded-full bg-gray-500 bg-opacity-40 p-2"
                    onClick={() => {
                        setIsQuestionModalOpen(true)
                    }}
                >
                    <div className="relative">
                        <QuestionMarkCircleIcon className="h-8 w-8" />
                        {/* <span className="absolute -top-2 -right-2 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                        </span> */}
                    </div>
                </button>

                {presentationGroupId && (
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl font-semibold">
                        *This presentation is presenting in group
                    </span>
                )}

                <span className="absolute bottom-4 left-8 -translate-x-1/2 text-2xl font-semibold">
                    {slideIndex.cur}
                </span>
            </div>
            {isChatboxModalOpen && (
                <CChatboxModal
                    isOpen={isChatboxModalOpen}
                    onClose={() => setIsChatboxModalOpen(false)}
                    presentationId={presentationId}
                    presentationGroupId={presentationGroupId}
                />
            )}
            {isQuestionModalOpen && (
                <CQuestionModal
                    isOpen={isQuestionModalOpen}
                    onClose={() => setIsQuestionModalOpen(false)}
                    presentationId={presentationId}
                    presentationGroupId={presentationGroupId}
                />
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={6}
            />
        </div>
    )
}

export default MSlide
