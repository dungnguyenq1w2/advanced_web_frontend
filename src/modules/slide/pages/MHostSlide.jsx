import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

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

function MHostSlide() {
    //#region data
    const { slideId } = useParams()
    const { data: _data, isLoading, set } = getForHost(slideId)
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
    }, [_data, set])
    //#endregion

    //#region event
    useEffect(() => {
        hostSocket.open()
        hostSocket.emit('subscribe', slideId)
        return () => {
            hostSocket.emit('unsubscribe', slideId)
        }
    }, [slideId])

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
    }, [newNumOfChoices])
    //#endregion

    return (
        <MSlide question={slide.question}>
            {isLoading ? <CLoading /> : <Bar options={options} data={slide.data} />}
        </MSlide>
    )
}

export default MHostSlide
