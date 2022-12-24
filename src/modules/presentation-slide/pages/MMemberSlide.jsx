import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

import { memberSocket } from 'common/config/socket'
import { getForMember } from 'common/queries-fn/slides.query'

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
import CLoading from 'common/components/CLoading'
import { getAllSlidesById } from 'common/queries-fn/presentations.query'
import { Bar } from 'react-chartjs-2'
import { getIP, getRandomColor } from 'utils/func'
import { MCheckbox, MSlide } from '../components'

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

    const [newChoices, setNewChoices] = useState()
    const [isShowChart, setIsShowChart] = useState(false)

    const { data: _slides, isLoading: isLoadingSlides } = getAllSlidesById(presentationId)

    const slidesId = useMemo(() => {
        if (_slides?.data?.slides) {
            const result = _slides?.data?.slides
            result.unshift(null)
            result.push(null)
            return result
        } else {
            return []
        }
    }, [_slides])

    const [slideIndex, setSlideIndex] = useState({ cur: 0, prev: null, next: null })

    const [memberId, setMemberId] = useState()

    const {
        data: _data,
        isLoading,
        set,
    } = getForMember(slidesId[slideIndex.cur]?.id, { memberId: memberId })

    const slide = useMemo(() => {
        return _data?.data
            ? {
                  question: _data.data.question,
                  data: {
                      labels: _data.data.choices.map((e) => e.content),
                      datasets: [
                          {
                              data: _data.data.choices.map((e) => e.n_choices),
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
    }, [_data, set])
    //#endregion

    //#region event
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

    useEffect(() => {
        if (slidesId[slideIndex.cur]?.id) {
            memberSocket.open()
            memberSocket.emit('subscribe', slidesId[slideIndex.cur].id)
        }
        return () => {
            if (slidesId[slideIndex.cur]?.id) {
                memberSocket.emit('unsubscribe', slidesId[slideIndex.cur].id)
            }
        }
    }, [slidesId, slideIndex.cur])

    useEffect(() => {
        memberSocket.on('server-send-choices', (memberId, choices) => {
            // Xử lí -> lưu state kết quả socket trả về
            // rồi tạo useEffect với dependency là state đó
            setNewChoices({ memberId, choices })
        })
        return () => {
            memberSocket.off('server-send-choices')
        }
    }, []) // Khi sử dụng socket.on thì bắt buộc phải để empty dependency

    // Xử lí cập nhật data
    useEffect(() => {
        if (newChoices) {
            const newData = { ..._data.data }
            newChoices.choices.forEach((addChoice) => {
                const index = newData.choices.findIndex(
                    (choice) => choice.id.toString() === addChoice.toString()
                )
                if (index > -1) {
                    newData.choices[index].n_choices += 1
                    newData.choices[index].user_choices.push('temp')
                }
            })
            set({ ..._data, data: newData })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newChoices])

    // Lấy memberId.
    // Nếu user đã đăng nhập thì lấy userId
    // Nếu là anonymous thì lấy IP
    useEffect(() => {
        if (localStorage.getItem('user')) {
            setMemberId(JSON.parse(localStorage.getItem('user')).id)
            return
        } else if (localStorage.getItem('ip')) {
            setMemberId(localStorage.getItem('ip'))
            return
        } else {
            const fetchIP = async () => {
                const ip = await getIP()
                setMemberId(ip)
            }
            fetchIP()
        }
    }, [])

    // Kiểm tra member đã chọn các lựa chọn chưa
    useEffect(() => {
        if (_data?.data) {
            setIsShowChart(_data.data.isChosen)
        }
    }, [_data])

    const handleChoiceSendSocket = (choices) => {
        memberSocket.emit('client-send-choices', slidesId[slideIndex.cur].id, memberId, choices)
        setIsShowChart(true)
    }
    //#endregion

    return (
        <MSlide
            question={slide.question}
            code={_slides?.data.code}
            presentationId={presentationId}
            slidesId={slidesId}
            slideIndex={slideIndex}
            onChangeSlide={setSlideIndex}
        >
            {isLoading || isLoadingSlides ? (
                <CLoading />
            ) : isShowChart ? (
                <div className="relative">
                    <Bar options={options} data={slide.data} />
                    <div
                        style={{ minWidth: '300px' }}
                        className="absolute right-20 top-40 max-h-[45rem] max-w-[20rem] rounded-lg bg-blue-900 bg-opacity-30 py-2 shadow-lg"
                    >
                        <h1 className="mb-3 py-3 text-center text-2xl font-bold">YOUR CHOICES</h1>
                        <ul>
                            {_data.data.choices
                                .filter((e) => e.user_choices.length === 1)
                                .map((e) => (
                                    <li
                                        key={e.id}
                                        className="border-t border-gray-600 px-4 py-2 text-xl font-medium"
                                    >
                                        {e.content}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex h-[90%] items-center justify-center">
                    <MCheckbox
                        choices={_data?.data.choices}
                        handleChoiceSendSocket={handleChoiceSendSocket}
                    />
                </div>
            )}
        </MSlide>
    )
}

export default MMemberSlide
