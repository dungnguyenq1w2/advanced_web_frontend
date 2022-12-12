import { XMarkIcon, PlayIcon } from '@heroicons/react/20/solid'
import { getAll as getAllSlides } from 'common/queries-fn/slides.query'
import { getAll as getAllChoices } from 'common/queries-fn/choices.query'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MNavbar from '../components/MNavbar'

function MPresentationEdit() {
    //#region data
    const { presentationId, slideId } = useParams()
    const { data: slidesData, isLoading: isSlidesDataLoading } = getAllSlides({
        presentationId: presentationId,
    })
    const { data: choicesData, isLoading: isChoicesDataLoading } = getAllChoices({
        slideId: slideId,
    })

    const slides = useMemo(() => slidesData?.data ?? [], [slidesData])
    const choices = useMemo(() => choicesData?.data ?? [], [choicesData])

    const [numberOptions, setnumberOptions] = useState(choices.length)

    const [slideChoices, setSlideChoices] = useState(choices)

    const [currentSlide, setCurrentSlide] = useState(
        slides.find((slide) => slide.id === parseInt(slideId)) ?? {}
    )

    useEffect(() => {
        setCurrentSlide(slides.find((slide) => slide.id === parseInt(slideId)))
        setnumberOptions(choices.length)
        setSlideChoices(choices)
    }, [slides, slideId, choices])

    console.log('-----------------')
    console.log(choices)
    console.log(slideChoices)

    //#endregion

    //#region event
    const addOption = () => {
        // if (numberOptions + 1 > 5) return alert('Number option from 1 to 5')
        setnumberOptions(numberOptions + 1)
        setSlideChoices([...slideChoices, { content: `Option ${slideChoices.length + 1}` }])
    }

    const removeOption = (index) => () => {
        const newSlideChoices = [...slideChoices]
        newSlideChoices.splice(index, 1)
        setSlideChoices(newSlideChoices)
    }

    const handleSlideClick = (e) => {}
    //#endregion

    return (
        <>
            <div className=" border-t-2 border-solid border-black bg-white p-1.5">
                <MNavbar />
            </div>
            <div className="px-10 py-5">
                <div className="flex h-[600px] transform bg-white">
                    <div className=" w-[300px] flex-none overflow-auto bg-slate-200">
                        {slides.map((slide, index) => {
                            const className =
                                parseInt(slideId) === slide.id
                                    ? 'flex flex-row border-4 border-indigo-200 border-b-indigo-500 bg-blue-300'
                                    : 'flex flex-row border-4 border-indigo-200 border-b-indigo-500'
                            return (
                                <Link
                                    key={index}
                                    to={`/presentation/${presentationId}/${slide.id}/edit`}
                                >
                                    <div className={className} onClick={handleSlideClick}>
                                        <div className="flex h-14 w-14 flex-col ">
                                            <div className="pl-3 text-xl">{index + 1}</div>
                                            {parseInt(slideId) === slide.id && (
                                                <PlayIcon className="h-12 w-12 cursor-pointer text-cyan-600" />
                                            )}
                                        </div>
                                        <div className="m-2 h-40 flex-1 rounded-sm bg-white p-2">
                                            Slide {index + 1}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* phần giữa */}
                    <div className="flex flex-1 bg-slate-300">
                        <div className="m-5 h-[550px] w-[650px] flex-1 rounded-sm bg-white">
                            Slide {slideId}
                        </div>
                    </div>

                    {/* Phần Description */}
                    <div className="flex w-[350px] flex-none flex-col">
                        <b className="mx-3 my-3 flex-none text-center">Description</b>
                        <div className="mx-3 my-6 flex-none">
                            <label
                                htmlFor="question"
                                className="mb-2 block text-sm font-bold text-gray-900 dark:text-white"
                            >
                                Your question:
                            </label>
                            <input
                                type="text"
                                id="question"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="Your question"
                                value={currentSlide?.question}
                                onChange={(e) => {
                                    setCurrentSlide({ ...currentSlide, question: e.target.value })
                                }}
                                required
                            />
                        </div>
                        <b className="mx-3 mt-1 mb-2 flex-none">Options: </b>
                        {/* choices.map((choice, index) => { */}
                        {isChoicesDataLoading && slideChoices?.length === 0 ? (
                            <></>
                        ) : (
                            slideChoices.map((item, index) => {
                                {
                                    /* const slideChoice = slideChoices[index] */
                                }
                                return (
                                    <div key={index} className="flex flex-none flex-row">
                                        <div className="ml-3 mb-3 flex-1">
                                            <input
                                                type="text"
                                                id={`option${index + 1}`}
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Input option"
                                                value={item?.content ?? `Option ${index + 1}`}
                                                onChange={(e) => {
                                                    const newChoice = {
                                                        ...item,
                                                        content: e.target.value,
                                                    }
                                                    const cloneChoices = [...slideChoices]

                                                    cloneChoices[index] = newChoice
                                                    setSlideChoices(cloneChoices)
                                                }}
                                                required
                                            />
                                        </div>
                                        <XMarkIcon
                                            className="mr-3 h-8 w-8 cursor-pointer text-[#F20000]"
                                            onClick={removeOption(index)}
                                        />
                                    </div>
                                )
                            })
                        )}

                        <button
                            className="bg-white-700 mx-24 mt-3 w-full rounded-lg border border-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-indigo-600 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                            onClick={addOption}
                        >
                            + Add option
                        </button>

                        <button className="mx-2 mt-5 mb-1 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
                            Save changes
                        </button>

                        <button className="mx-2 mt-5 mb-1 w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto">
                            Delete slide
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MPresentationEdit
