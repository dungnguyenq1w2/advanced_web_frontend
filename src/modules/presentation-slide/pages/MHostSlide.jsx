import { Suspense, useEffect, useMemo, useState } from 'react'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { getForHostById as getPresentationForHostById } from 'common/queries-fn/presentations.query'
import { getForHostById as getSlideForHostById } from 'common/queries-fn/slides.query'

import CLoading from 'common/components/CLoading'

import { MHeading, MHostMultipleChoice, MParagraph, MSlide } from '../components'

function MHostSlide() {
    //#region data
    const { presentationId } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

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

    const {
        data: slide,
        isLoading: isSlideLoading,
        set,
    } = getSlideForHostById(slidesId[slideIndex.cur]?.id, {
        presentationGroupId: searchParams.get('id'), // presentation_group_id
    })
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
    //#endregion

    return (
        <MSlide
            type={slidesId[slideIndex.cur]?.type}
            code={presentation?.data.code}
            presentationGroupId={searchParams.get('id')}
            presentationId={presentationId}
            slidesId={slidesId}
            slideIndex={slideIndex}
            onChangeSlide={setSlideIndex}
        >
            {isPresentationLoading ? (
                <CLoading />
            ) : (
                <>
                    {slidesId[slideIndex.cur]?.type === 1 && (
                        <MHeading data={slide?.data} isLoading={isSlideLoading} />
                    )}

                    {slidesId[slideIndex.cur]?.type === 2 && (
                        <MParagraph data={slide?.data} isLoading={isSlideLoading} />
                    )}

                    {slidesId[slideIndex.cur]?.type === 3 && (
                        <Suspense fallback={<CLoading />}>
                            <MHostMultipleChoice
                                slideId={slidesId[slideIndex.cur].id}
                                presentationGroupId={searchParams.get('id')}
                                data={slide}
                                isLoading={isSlideLoading}
                                set={set}
                            />
                        </Suspense>
                    )}
                </>
            )}
        </MSlide>
    )
}

export default MHostSlide
