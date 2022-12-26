import { useState } from 'react'

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

function MSlide({ children, code, presentationId, slidesId, slideIndex, onChangeSlide }) {
    //#region Data
    const [isCopied, setIsCopied] = useState(false)
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
            `${window.location.host}/presentation-slide/${presentationId}/member`
        )
        setIsCopied(true)
    }
    //#endregion
    return (
        <div
            className="relative mx-20 h-full min-w-[1700px] bg-contain bg-center bg-no-repeat text-white before:absolute before:top-0 before:h-screen before:w-[91vw] before:bg-black before:bg-opacity-40"
            style={{
                backgroundImage:
                    'url(https://images.mentimeter.com/images/dfa03a55-5287-45a3-977e-f688148bd0aa.png?auto=compress%2Cformat&fm=png&w=2000)',
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
                            {`${window.location.host}/presentation-slide/${presentationId}/member`}
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
                <button
                    className={`absolute top-[45%] left-5 rounded-full bg-gray-500 bg-opacity-40 p-2 ${
                        !slidesId[slideIndex.prev] && 'opacity-20'
                    }`}
                    onClick={handleSlideChange('PREV')}
                    disabled={!slidesId[slideIndex.prev]}
                >
                    <ChevronLeftIcon className="h-10 w-10" />
                </button>
                <button
                    className={`absolute top-[45%] right-5 rounded-full bg-gray-500 bg-opacity-40 p-2 ${
                        !slidesId[slideIndex.next] && 'opacity-20'
                    }`}
                    onClick={handleSlideChange('NEXT')}
                    disabled={!slidesId[slideIndex.next]}
                >
                    <ChevronRightIcon className="h-10 w-10" />
                </button>
            </div>
        </div>
    )
}

export default MSlide
