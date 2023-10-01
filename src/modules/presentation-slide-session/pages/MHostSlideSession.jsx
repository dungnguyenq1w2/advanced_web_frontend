import { Suspense, useEffect, useMemo, useState } from 'react'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { MHeading, MParagraph } from 'modules/presentation-slide/components'

import { getForHostById as getPresentationForHostById } from 'common/queries-fn/presentations.query'

import { hostSocket, messageSocket, presentationSocket, questionSocket } from 'common/socket'
import CLoading from 'common/components/CLoading'

import { MHostMultipleChoiceSession, MSlideSession } from '../components'

function MHostSlide() {
    //#region data
    const { presentationId } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [slide, setSlide] = useState({})
    const [isSlideLoading, setIsSlideLoading] = useState(false)

    const { data: presentation, isLoading: isPresentationLoading } = getPresentationForHostById(
        presentationId,
        {
            presentationGroupId: searchParams.get('id'), // presentation_group_id
        }
    )

    // Slide id array: [null, slideId  1, slideId 2,.., null] of this presentation
    const slidesId = useMemo(() => {
        if (presentation?.data?.slides) {
            const result = [...presentation?.data?.slides]
            result.unshift(null)
            result.push(null)
            return result
        } else {
            return []
        }
    }, [presentation])

    const [slideIndex, setSlideIndex] = useState({ cur: 1, prev: null, next: null })

    //#endregion

    //#region event
    // Authorization
    useEffect(() => {
        if (presentation?.data) {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                if (presentation.data.permission.isAllowed === false) {
                    alert(presentation.data.permission.message)
                    navigate(-1)
                }
            } else {
                alert('You are not allowed access this page')
                navigate('/')
            }
        }
    }, [presentation, navigate])

    useEffect(() => {
        hostSocket.open()
        setIsSlideLoading(true)
        hostSocket.emit(
            'client-get-slideForHost-session',
            slidesId[slideIndex.cur]?.id,
            searchParams.get('id')
        )

        return () => {
            hostSocket.emit(
                'client-send-stop-session',
                slidesId[slideIndex.cur]?.id,
                searchParams.get('id')
            )
        }
    }, [slideIndex, slidesId, searchParams])

    useEffect(() => {
        return () => {
            if (searchParams.get('id')) {
                presentationSocket.open()
                presentationSocket.emit(
                    'client-stop-presentation',
                    presentationId,
                    searchParams.get('id')
                )
            }
            hostSocket.open()
            hostSocket.emit(
                'client-stop-presentation-session',
                presentationId,
                searchParams.get('id') ?? null
            )
            messageSocket.emit(
                'client-stop-message-session',
                presentationId,
                searchParams.get('id') ?? null
            )
            questionSocket.emit(
                'client-stop-question-session',
                presentationId,
                searchParams.get('id') ?? null
            )
        }
    }, [presentationId, searchParams])

    useEffect(() => {
        hostSocket.on('server-send-slideForHost-session', (slide) => {
            setSlide(slide)
            setTimeout(() => setIsSlideLoading(false), 100)
        })

        return () => {
            hostSocket.off('server-send-slideForHost-session')
        }
    }, [])

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

    const handleChangeSlide = (_slideIndex) => {
        hostSocket.open()
        hostSocket.emit(
            'client-send-changeSlide',
            slidesId[slideIndex.cur].id,
            _slideIndex,
            searchParams.get('id')
        )
        setSlideIndex(_slideIndex)
    }
    //#endregion

    return (
        <MSlideSession
            type={slidesId[slideIndex.cur]?.type}
            code={presentation?.data.code}
            presentationGroupId={searchParams.get('id')}
            presentationId={presentationId}
            slidesId={slidesId}
            slideIndex={slideIndex}
            onChangeSlide={handleChangeSlide}
        >
            {isPresentationLoading ? (
                <CLoading />
            ) : (
                <>
                    {slidesId[slideIndex.cur]?.type === 1 && (
                        <MHeading data={slide} isLoading={isSlideLoading} />
                    )}

                    {slidesId[slideIndex.cur]?.type === 2 && (
                        <MParagraph data={slide} isLoading={isSlideLoading} />
                    )}

                    {slidesId[slideIndex.cur]?.type === 3 && (
                        <Suspense fallback={<CLoading />}>
                            <MHostMultipleChoiceSession
                                slideId={slidesId[slideIndex.cur].id}
                                presentationGroupId={searchParams.get('id')}
                                data={slide}
                                isLoading={isSlideLoading}
                                set={setSlide}
                            />
                        </Suspense>
                    )}
                </>
            )}
        </MSlideSession>
    )
}

export default MHostSlide
