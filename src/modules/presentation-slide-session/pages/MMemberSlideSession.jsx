import { Suspense, useEffect, useMemo, useState } from 'react'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { memberSocket } from 'common/socket'

import { getForMemberById as getPresentationForMemberById } from 'common/queries-fn/presentations.query'

import { MHeading, MParagraph } from 'modules/presentation-slide/components'
import CLoading from 'common/components/CLoading'

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Colors,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js'
import { getIP } from 'utils/func'
import { MMemberMultipleChoiceSession, MSlideSession } from '../components'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

export const options = {
    responsive: true,
    layout: {
        padding: { top: 230, bottom: 30, left: 150, right: 450 },
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
    },
    scales: {
        y: {
            ticks: {
                font: {
                    size: 24,
                },
                color: 'white',
                beginAtZero: true,
                callback: function (value) {
                    if (value % 1 === 0) {
                        return value
                    }
                },
            },
            value: {},
        },
        x: {
            ticks: {
                font: {
                    size: 30,
                },
                color: 'white',
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: true,
            intersect: false,
        },
        title: {
            display: false,
        },
    },
}

function MMemberSlide() {
    //#region data
    const { presentationId } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    // const [member, setMember] = useState()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [slide, setSlide] = useState({})
    const [isSlideLoading, setIsSlideLoading] = useState(false)

    const me = useMemo(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            delete user.accessToken
            delete user.refreshToken
            delete user.email
            return user
        } else {
            const anonymous = JSON.parse(localStorage.getItem('anonymous'))
            if (anonymous) {
                return anonymous
            } else {
                const fetchIP = async () => {
                    const ip = await getIP()
                    return { id: ip, name: 'Anonymous' }
                }
                return fetchIP()
            }
        }
    }, [])

    const { data: presentation, isLoading: isPresentationLoading } = getPresentationForMemberById(
        presentationId,
        {
            presentationGroupId: searchParams.get('id'), // presentation_group_id
            userId: JSON.parse(localStorage.getItem('user'))?.id,
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
        if (presentation?.data?.permission) {
            if (presentation.data.permission.isAllowed === false) {
                alert(presentation.data.permission.message)
                navigate(-1)
            }
        }
    }, [presentation, navigate])

    useEffect(() => {
        memberSocket.open()
        setIsSlideLoading(true)
        memberSocket.emit(
            'client-get-slideForMember-session',
            slidesId[slideIndex.cur]?.id,
            searchParams.get('id'),
            me
        )
    }, [slideIndex, slidesId, searchParams, me])

    useEffect(() => {
        memberSocket.on('server-send-slideForMember-session', (slide) => {
            setSlide(slide)
            setTimeout(() => setIsSlideLoading(false), 100)
        })

        return () => {
            memberSocket.off('server-send-slideForMember-session')
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

    // Lấy memberId.
    // Nếu user đã đăng nhập thì lấy userId
    // Nếu là anonymous thì lấy IP
    // useEffect(() => {
    //     if (localStorage.getItem('user')) {
    //         const user = JSON.parse(localStorage.getItem('user'))
    //         delete user.accessToken
    //         delete user.refreshToken
    //         setMember(user)
    //     } else if (localStorage.getItem('ip')) {
    //         setMember(JSON.parse(localStorage.getItem('anonomous')))
    //     } else {
    //         const fetchIP = async () => {
    //             const ip = await getIP()
    //             setMember({ id: ip, name: 'Anonymous' })
    //         }
    //         fetchIP()
    //     }
    // }, [])

    useEffect(() => {
        memberSocket.open()
        memberSocket.on('server-send-changeSlide', (_slideIndex) => {
            setSlideIndex({ ..._slideIndex })
        })
    }, [])
    //#endregion
    return (
        <MSlideSession
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
                        <MHeading data={slide} isLoading={isSlideLoading} />
                    )}

                    {slidesId[slideIndex.cur]?.type === 2 && (
                        <MParagraph data={slide} isLoading={isSlideLoading} />
                    )}

                    {slidesId[slideIndex.cur]?.type === 3 && (
                        <Suspense fallback={<CLoading />}>
                            <MMemberMultipleChoiceSession
                                slideId={slidesId[slideIndex.cur].id}
                                member={me}
                                presentationGroupId={searchParams.get('id')}
                                data={slide}
                                isLoading={isSlideLoading}
                                set={setSlide}
                                isSubmitted={isSubmitted}
                                onSubmit={setIsSubmitted}
                            />
                        </Suspense>
                    )}
                </>
            )}
        </MSlideSession>
    )
}
export default MMemberSlide
