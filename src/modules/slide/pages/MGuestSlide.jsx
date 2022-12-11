import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

import { guestSocket } from 'common/config/socket'
import { getForGuest } from 'common/queries-fn/slides.query'

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
import { Bar } from 'react-chartjs-2'
import { getIP } from 'utils/func'
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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('')
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

// const labels = [
//     'January',
//     'February',
//     'January',
//     'February',
//     'January',
//     'February',
//     'January',
//     'February',
// ]

// export const data = {
//     labels,
//     datasets: [
//         {
//             data: [45, 25, 45, 25, 45, 25, 45, 25],
//             backgroundColor: [getRandomColor(), getRandomColor()],
//             barThickness: 80,
//             maxBarThickness: 100,
//         },
//     ],
// }

function MGuestSlide() {
    //#region data
    const { slideId } = useParams()
    const [newNumOfChoices, setNewNumOfChoices] = useState()
    const [isShowChart, setIsShowChart] = useState(false)
    const [guestId, setGuestId] = useState()

    const { data: _data, isLoading, set } = getForGuest(slideId, { guestId: guestId })

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
        guestSocket.open()
        guestSocket.emit('subscribe', slideId)
        return () => {
            guestSocket.emit('unsubscribe', slideId)
        }
    }, [slideId])

    useEffect(() => {
        guestSocket.on('server-send-choices', (choices) => {
            console.log('🚀 ~ choices', choices)
            // Xử lí -> lưu state kết quả socket trả về
            // rồi tạo useEffect với dependency là state đó
            setNewNumOfChoices(choices)
        })
        return () => {
            guestSocket.off('server-send-choices')
        }
    }, []) // Khi sử dụng socket.on thì bắt buộc phải để empty dependency

    // Xử lí cập nhật data
    useEffect(() => {
        if (newNumOfChoices) {
            const newData = { ..._data.data }
            console.log('🚀 ~ newData', newData)
            newNumOfChoices.forEach((addChoice) => {
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
    }, [newNumOfChoices])

    // Lấy guestId.
    // Nếu user đã đăng nhập thì lấy userId
    // Nếu là anonymous thì lấy IP
    useEffect(() => {
        if (localStorage.getItem('user')) {
            setGuestId(JSON.parse(localStorage.getItem('user')).id)
            return
        } else if (localStorage.getItem('ip')) {
            setGuestId(localStorage.getItem('ip'))
            return
        } else {
            const fetchIP = async () => {
                const ip = await getIP()
                setGuestId(ip)
            }
            fetchIP()
        }
    }, [])

    // Kiểm tra guest đã chọn các lựa chọn chưa
    useEffect(() => {
        if (_data?.data) {
            setIsShowChart(_data.data.isChosen)
        }
    }, [_data])

    const handleChoiceSendSocket = (choices) => {
        guestSocket.emit('client-send-choices', slideId, guestId, choices)
        setIsShowChart(true)
    }
    //#endregion

    return (
        <MSlide question={slide.question}>
            {isLoading ? (
                <CLoading />
            ) : isShowChart ? (
                <div className="relative">
                    <Bar options={options} data={slide.data} />
                    <div
                        style={{ minWidth: '300px' }}
                        className="absolute right-20 top-40 max-w-[20rem] rounded-lg bg-blue-900 bg-opacity-30 py-2 shadow-lg"
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

export default MGuestSlide
