import '../assets/styles/index.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { add as addChoice, remove as removeChoice, update as updateChoice } from 'apis/choice.api'
import { update as updateSlide } from 'apis/slide.api'

import { slideSocket } from 'common/socket'

import { getAll as getAllChoices } from 'common/queries-fn/choices.query'
import {
    getAll as getAllSlides,
    getForHostById as getSlideForHost,
} from 'common/queries-fn/slides.query'

import { PlayIcon, XMarkIcon } from '@heroicons/react/20/solid'
import MConfirmationModal from '../components/MConfirmationModal'
import MHeader from '../components/MHeader'
import MSlide from '../components/MSlide'

import { getRandomColor } from 'utils/func'

function MPresentationEdit() {
    //#region data
    const { presentationId, slideId } = useParams()

    const confirmationModalRef = useRef()

    const {
        data: slidesData,
        isLoading: isSlidesDataLoading,
        refetch: refetchSlides,
    } = getAllSlides({
        presentationId: presentationId,
    })

    const {
        data: choicesData,
        isLoading: isChoicesDataLoading,
        refetch: refetchChoices,
    } = getAllChoices({
        slideId: slideId,
    })

    const {
        data: _slideData,
        isLoading: isSlideDataLoading,
        set: setSlideData,
        refetch: refetchSlideData,
    } = getSlideForHost(slideId)

    const slideData = useMemo(() => {
        return _slideData?.data?.id
            ? {
                  question: _slideData.data.question,
                  data: {
                      labels: _slideData.data.choices.map((e) => e.content),
                      datasets: [
                          {
                              data: _slideData.data.choices.map((e) => e.n_choices),
                              backgroundColor: [
                                  getRandomColor(),
                                  getRandomColor(),
                                  getRandomColor(),
                                  getRandomColor(),
                              ],
                              barThickness: 80,
                              maxBarThickness: 100,
                          },
                      ],
                  },
              }
            : {
                  question: '',
                  data: {
                      labels: [],
                      datasets: [
                          {
                              data: [],
                              backgroundColor: [getRandomColor(), getRandomColor()],
                              barThickness: 80,
                              maxBarThickness: 100,
                          },
                      ],
                  },
              }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_slideData])

    const slides = useMemo(() => slidesData?.data ?? [], [slidesData])
    const choices = useMemo(() => choicesData?.data ?? [], [choicesData])

    const [numberOptions, setnumberOptions] = useState(choices.length)

    const [slideChoices, setSlideChoices] = useState(choices)

    const [currentSlide, setCurrentSlide] = useState(
        slides.find((slide) => slide.id === parseInt(slideId)) ?? {}
    )

    //#endregion

    //#region event
    useEffect(() => {
        setCurrentSlide(slides.find((slide) => slide.id === parseInt(slideId)))
        setnumberOptions(choices.length)
        setSlideChoices(choices)
    }, [slides, slideId, choices])

    const handleAddChoice = () => {
        setnumberOptions(numberOptions + 1)
        setSlideChoices([
            ...slideChoices,
            {
                content: `Option`,
                // content: ``,
                slide_id: slideId,
                action: 'ADD',
            },
        ])
    }

    const handleRemoveChoice = (index) => () => {
        const newSlideChoices = [...slideChoices]
        if (newSlideChoices[index].action && newSlideChoices[index]?.action === 'ADD') {
            newSlideChoices.splice(index, 1)
        } else {
            newSlideChoices[index].action = 'DELETE'
        }
        setSlideChoices(newSlideChoices)
    }

    const handleSaveSlide = async () => {
        try {
            const type = currentSlide?.type
            const isSlideChange = typeof currentSlide?.change !== 'undefined'

            if (isSlideChange) {
                const changeParams =
                    type === 3
                        ? { question: currentSlide?.question }
                        : type === 2
                        ? {
                              heading: currentSlide?.heading,
                              paragraph: currentSlide?.paragraph,
                          }
                        : {
                              heading: currentSlide?.heading,
                              subheading: currentSlide?.subheading,
                          }

                await updateSlide(slideId, changeParams)

                refetchSlides()
                refetchSlideData()
            }

            // if Multiple choice slide: save choices
            if (type === 3) {
                const isChoicesChange = slideChoices.findIndex((choice) => choice?.action) !== -1

                if (isChoicesChange) {
                    for (const choice of slideChoices) {
                        if (choice?.action) {
                            const { action, id, ...choiceData } = choice
                            switch (choice?.action) {
                                case 'ADD':
                                    await addChoice(choiceData)
                                    break
                                case 'UPDATE':
                                    await updateChoice(id, choiceData)
                                    break
                                case 'DELETE':
                                    await removeChoice(id)
                                    break
                                default:
                                    break
                            }
                        }
                    }

                    refetchChoices()
                    refetchSlideData()
                }
            }
        } catch (error) {
            console.log('Error:', error)
        }
    }

    const handleSlideClick = (e) => {}
    //#endregion

    return (
        <>
            <div className=" border-t-2 border-solid border-black bg-white p-1.5">
                <MHeader presentationId={presentationId} refetchSlides={refetchSlides} />
            </div>
            <div className="px-10 py-5">
                <div className="flex h-[570px] transform bg-white">
                    <div className=" custom-scrollbar w-[300px] flex-none overflow-auto  bg-slate-200">
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
                                        <div className="m-2 flex h-40 w-60 flex-col items-center justify-center rounded-sm bg-white p-2 text-center">
                                            {slide?.type === 3 ? (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="h-16 w-16"
                                                    >
                                                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                                                    </svg>

                                                    <span className="text-lg font-medium">
                                                        Multiple choice
                                                    </span>
                                                </>
                                            ) : slide?.type === 2 ? (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="h-16 w-16"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                                                            clipRule="evenodd"
                                                        />
                                                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                                    </svg>

                                                    <span className="text-lg font-medium">
                                                        Paragraph
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="h-16 w-16"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M3 9a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9zm0 6.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>

                                                    <span className="text-lg font-medium">
                                                        Heading
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* phần giữa */}
                    <div className="flex flex-1 bg-slate-300">
                        <div className="m-5 h-[530px] w-[650px] flex-1 rounded-sm bg-white">
                            <MSlide slideData={slideData} isSlideDataLoading={isSlideDataLoading} />
                        </div>
                    </div>

                    {/* Phần Description */}
                    <div className="flex w-[350px] flex-none flex-col">
                        {currentSlide?.type === 3 ? (
                            <>
                                <div className="mx-3 flex-none py-2">
                                    <label
                                        htmlFor="question"
                                        className="mb-2 block text-lg font-bold text-gray-900 dark:text-white"
                                    >
                                        Your question:
                                    </label>
                                    <input
                                        type="text"
                                        id="question"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Your question"
                                        autoFocus
                                        value={currentSlide?.question ?? 'Question'}
                                        onChange={(e) => {
                                            setCurrentSlide({
                                                ...currentSlide,
                                                question: e.target.value,
                                                change: true,
                                            })
                                        }}
                                        required
                                    />
                                </div>
                                <b className="mx-3 mb-2 flex-none text-lg">Options: </b>
                                {/* choices.map((choice, index) => { */}
                                <div className="custom-scrollbar flex-1 overflow-auto">
                                    {isChoicesDataLoading && slideChoices?.length === 0 ? (
                                        <></>
                                    ) : (
                                        slideChoices.map((choice, index) => {
                                            return choice?.action && choice?.action === 'DELETE' ? (
                                                <div key={index}></div>
                                            ) : (
                                                <div
                                                    key={index}
                                                    className="flex flex-none flex-row"
                                                >
                                                    <div className="ml-3 mb-3 flex-1">
                                                        <input
                                                            type="text"
                                                            id={`option${index + 1}`}
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Input option"
                                                            value={choice?.content ?? `Option`}
                                                            onChange={(e) => {
                                                                const newChoice = {
                                                                    ...choice,
                                                                    content: e.target.value,
                                                                    action: choice?.id
                                                                        ? 'UPDATE'
                                                                        : 'ADD',
                                                                }
                                                                const cloneChoices = [
                                                                    ...slideChoices,
                                                                ]

                                                                cloneChoices[index] = newChoice
                                                                setSlideChoices(cloneChoices)
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                    <XMarkIcon
                                                        className="mr-3 h-8 w-8 cursor-pointer text-[#F20000]"
                                                        onClick={handleRemoveChoice(index)}
                                                    />
                                                </div>
                                            )
                                        })
                                    )}
                                </div>

                                <button
                                    className="bg-white-700 mx-24 mt-3 w-full rounded-lg border border-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-indigo-600 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                                    onClick={handleAddChoice}
                                >
                                    + Add option
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="mx-3 flex-none py-2">
                                    <label
                                        htmlFor="heading"
                                        className="mb-2 block text-lg font-bold text-gray-900"
                                    >
                                        Heading:
                                    </label>
                                    <input
                                        type="text"
                                        id="heading"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Your heading"
                                        autoFocus
                                        value={currentSlide?.heading ?? 'Heading'}
                                        onChange={(e) => {
                                            setCurrentSlide({
                                                ...currentSlide,
                                                heading: e.target.value,
                                                change: true,
                                            })
                                        }}
                                        required
                                    />
                                </div>
                                {/* <b className="mx-3 mt-1 mb-2 flex-none text-lg">Paragraph: </b> */}

                                {currentSlide?.type === 2 ? (
                                    <div className="mx-3 flex-1">
                                        <label
                                            htmlFor="paragraph"
                                            className="mb-2 text-lg font-bold text-gray-900"
                                        >
                                            Paragraph:
                                        </label>
                                        <input
                                            type="text"
                                            id="paragraph"
                                            className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Your paragraph"
                                            autoFocus
                                            value={currentSlide?.paragraph ?? 'Heading'}
                                            onChange={(e) => {
                                                setCurrentSlide({
                                                    ...currentSlide,
                                                    paragraph: e.target.value,
                                                    change: true,
                                                })
                                            }}
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="mx-3 flex-1">
                                        <label
                                            htmlFor="subheading"
                                            className="mb-2 text-lg font-bold text-gray-900"
                                        >
                                            Subheading:
                                        </label>
                                        <input
                                            type="text"
                                            id="subheading"
                                            className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Your subheading"
                                            autoFocus
                                            value={currentSlide?.subheading ?? 'Heading'}
                                            onChange={(e) => {
                                                setCurrentSlide({
                                                    ...currentSlide,
                                                    subheading: e.target.value,
                                                    change: true,
                                                })
                                            }}
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            className="mx-2 mt-6 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                            onClick={handleSaveSlide}
                        >
                            Save changes
                        </button>

                        <button
                            className="mx-2 mt-2 w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
                            disabled={slides?.length === 1}
                            title={
                                slides?.length === 1
                                    ? 'Presentation must have at least 1 slide'
                                    : ''
                            }
                            onClick={() => {
                                confirmationModalRef.current.open()
                            }}
                        >
                            Delete slide
                        </button>
                    </div>
                </div>
            </div>
            <MConfirmationModal
                ref={confirmationModalRef}
                slideId={slideId}
                refetchSlides={refetchSlides}
                presentationId={presentationId}
            />
        </>
    )
}

export default MPresentationEdit
