import { useState } from 'react'

import {
    ChatBubbleBottomCenterTextIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { MChatboxModal, MQuestionModal } from '.'

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
    //#endregion

    //#region Event
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
            className="relative mx-20 h-full min-w-[1700px] animate-[show-slow_0.25s_ease-in] bg-cover bg-center bg-no-repeat text-white before:absolute before:top-0 before:h-screen before:w-[91vw] before:bg-black before:bg-opacity-40"
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
                        <span className="absolute -top-2 -right-2 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                        </span>
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
                        <span className="absolute -top-2 -right-2 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                        </span>
                    </div>
                </button>

                {presentationGroupId && (
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl font-semibold">
                        *This presentation is presenting in group
                    </span>
                )}
            </div>
            {isChatboxModalOpen && (
                <MChatboxModal
                    isOpen={isChatboxModalOpen}
                    onClose={() => setIsChatboxModalOpen(false)}
                />
            )}
            {isQuestionModalOpen && (
                <MQuestionModal
                    isOpen={isQuestionModalOpen}
                    onClose={() => setIsQuestionModalOpen(false)}
                />
            )}
        </div>
    )
}

export default MSlide
