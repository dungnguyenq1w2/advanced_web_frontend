import { useEffect, useMemo, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { hostSocket } from 'common/config/socket'
import { getForHost } from 'common/queries-fn/slides.query'

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
import { MSlide } from '../components'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

export const options = {
    responsive: true,
    layout: {
        padding: { top: 230, bottom: 30, left: 250, right: 250 },
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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('')
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function MHostSlide() {
    //#region data
    const { presentationId } = useParams()
    const navigate = useNavigate()
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

    const { data: _data, isLoading, set } = getForHost(slidesId[slideIndex.cur]?.id)

    const [newNumOfChoices, setNewNumOfChoices] = useState()

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
        if (_slides?.data) {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                if (_slides.data.host_id.toString() !== user.id.toString()) {
                    alert('You are not allowed access this page')
                    navigate('/')
                }
            } else {
                alert('You are not allowed access this page')
                navigate('/')
            }
        }
    }, [_slides, navigate])

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
            hostSocket.open()
            hostSocket.emit('subscribe', slidesId[slideIndex.cur].id)
        }
        return () => {
            if (slidesId[slideIndex.cur]?.id) {
                hostSocket.emit('unsubscribe', slidesId[slideIndex.cur].id)
            }
        }
    }, [slidesId, slideIndex.cur])

    useEffect(() => {
        hostSocket.on('server-send-choices', (choices) => {
            // Xử lí -> lưu state kết quả socket trả về
            // rồi tạo useEffect với dependency là state đó
            setNewNumOfChoices(choices)
        })
        return () => {
            hostSocket.off('server-send-choices')
        }
    }, []) // Khi sử dụng socket.on thì bắt buộc phải để empty dependency

    // Xử lí cập nhật data
    useEffect(() => {
        if (newNumOfChoices) {
            const newData = { ..._data.data }
            newNumOfChoices.forEach((addChoice) => {
                const index = newData.choices.findIndex(
                    (choice) => choice.id.toString() === addChoice.toString()
                )
                if (index > -1) {
                    newData.choices[index].n_choices += 1
                }
            })
            set({ ..._data, data: newData })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newNumOfChoices])
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
            ) : (
                <Bar options={options} data={slide.data} />
            )}
        </MSlide>
    )
}

export default MHostSlide
