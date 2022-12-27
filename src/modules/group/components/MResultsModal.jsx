import 'modules/presentation-slide/assets/style/index.css'

import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

import { getForHostById as getPresentationForHostById } from 'common/queries-fn/presentations.query'
import { getForHostById as getSlideForHostById } from 'common/queries-fn/slides.query'

import CModal from 'common/components/CModal'
import CLoading from 'common/components/CLoading'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Avatar, Tabs, Tooltip } from 'flowbite-react'
import moment from 'moment'

const MResultsModal = ({ isOpen, onClose, presentationId }) => {
    //#region data
    const { groupId } = useParams()
    const { data: _presentation, isLoading: isPresentationLoading } = getPresentationForHostById(
        presentationId,
        {
            groupId,
        }
    )

    // Slide id array: [null, slideId  1, slideId 2,.., null] of this presentation
    const slidesId = useMemo(() => {
        if (_presentation?.data?.slides) {
            const result = [..._presentation?.data?.slides]
            result.unshift(null)
            result.push(null)
            return result
        } else {
            return []
        }
    }, [_presentation])

    const [slideIndex, setSlideIndex] = useState({ cur: 1, prev: null, next: null })

    const { data: slide, isLoading: isSlideLoading } = getSlideForHostById(
        slidesId[slideIndex.cur]?.id
    )
    //#endregion

    //#region event
    // Update slide index of this presentation when change slidesId
    useEffect(() => {
        if (slidesId.length) {
            setSlideIndex({
                ...slideIndex,
                cur: 1,
                prev: null,
                next: slidesId.length === 3 ? null : slidesId.length > 3 ? 2 : null,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slidesId])

    const handleSlideChange = (type) => () => {
        if (type === 'PREV') {
            setSlideIndex({
                ...slideIndex,
                cur: slideIndex.prev,
                prev: slideIndex.prev - 1,
                next: slideIndex.next - 1,
            })
        }
        if (type === 'NEXT') {
            setSlideIndex({
                ...slideIndex,
                cur: slideIndex.next,
                prev: slideIndex.prev + 1,
                next: slideIndex.next + 1,
            })
        }
    }
    //#endregion

    return (
        <>
            <CModal title="Results" isOpen={isOpen} onClose={onClose}>
                <div className="h-[450px] overflow-auto">
                    {isSlideLoading || isPresentationLoading ? (
                        <CLoading />
                    ) : (
                        <>
                            {slide.data.type === 1 && (
                                <h1 className="pt-5 text-center text-3xl">Heading slide</h1>
                            )}
                            {slide.data.type === 2 && (
                                <h1 className="pt-5 text-center text-3xl">Paragraph slide</h1>
                            )}
                            {slide.data.type === 3 && (
                                <>
                                    <div className="bg-gray-50 p-3">
                                        <h3 className="text-lg font-semibold">
                                            {slide.data.question}
                                        </h3>
                                    </div>
                                    <Tabs.Group
                                        aria-label="Tabs with underline"
                                        // eslint-disable-next-line react/style-prop-object
                                        style="underline"
                                        id="results__tab"
                                    >
                                        {slide.data.choices?.map((choice, index) => (
                                            <Tabs.Item
                                                key={choice.id}
                                                title={`${choice.content} (${choice.user_choices.length})`}
                                                active={index === 0 && true}
                                                // id="tab__item"
                                            >
                                                <span className="block text-right text-sm text-gray-500">
                                                    {choice.user_choices.length}{' '}
                                                    {choice.user_choices.length > 1
                                                        ? 'records'
                                                        : 'record'}
                                                </span>
                                                {choice.user_choices.map((e, i) => (
                                                    <div
                                                        key={e.id}
                                                        className={`flex items-center justify-between border-b py-1 px-2`}
                                                    >
                                                        <div className="flex items-center">
                                                            <Avatar
                                                                img={
                                                                    e.member ? e.member.image : null
                                                                }
                                                                rounded={true}
                                                                className="mr-3"
                                                            />
                                                            <span>
                                                                {e.member
                                                                    ? e.member.name
                                                                    : 'Anonymous'}
                                                            </span>
                                                        </div>

                                                        <span className="cursor-default text-sm text-gray-600">
                                                            <Tooltip
                                                                content={moment(e.created_at)
                                                                    .utc()
                                                                    .format('hh:mm:ss MM/DD/YY')}
                                                            >
                                                                {moment(e.created_at)
                                                                    .utc()
                                                                    .fromNow()}
                                                            </Tooltip>
                                                        </span>
                                                    </div>
                                                ))}
                                            </Tabs.Item>
                                        ))}
                                    </Tabs.Group>
                                </>
                            )}
                        </>
                    )}
                    <button
                        className={`absolute bottom-2 left-2 rounded-full bg-gray-500 bg-opacity-40 p-2 ${
                            !slidesId[slideIndex.prev] && 'opacity-20'
                        }`}
                        onClick={handleSlideChange('PREV')}
                        disabled={!slidesId[slideIndex.prev]}
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        className={`absolute bottom-2 right-2 rounded-full bg-gray-500 bg-opacity-40 p-2 ${
                            !slidesId[slideIndex.next] && 'opacity-20'
                        }`}
                        onClick={handleSlideChange('NEXT')}
                        disabled={!slidesId[slideIndex.next]}
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </CModal>
        </>
    )
}

export default MResultsModal
