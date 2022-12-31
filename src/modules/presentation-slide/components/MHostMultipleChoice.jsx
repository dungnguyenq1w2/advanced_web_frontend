import { useEffect, useMemo, useState } from 'react'

import { hostSocket } from 'common/socket'

import CLoading from 'common/components/CLoading'

import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline'
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
import { Bar } from 'react-chartjs-2'
import { getRandomColor } from 'utils/func'
import MResultsModal from './MResultsModal'

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

function MHostMultipleChoice({ slideId, presentationGroupId, data, isLoading, set }) {
    //#region Data
    const [isResultModalOpen, setIsResultModalOpen] = useState(false)

    // Save data from socket 'server-send-choices'
    const [newChoices, setNewChoices] = useState()

    // const { data, isLoading, set } = getSlideForHostById(slideId)

    const slide = useMemo(() => {
        return data?.data?.id
            ? {
                  question: data.data.question,
                  data: {
                      labels: data.data.choices.map((e) => e.content),
                      datasets: [
                          {
                              data: data.data.choices.map((e) => e.user_choices.length),
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
    }, [data, set])
    //#endregion

    //#region Event
    // Connect socket
    useEffect(() => {
        if (slideId) {
            hostSocket.open()
            hostSocket.emit('subscribe', slideId, presentationGroupId)
        }
        return () => {
            if (slideId) {
                hostSocket.emit('unsubscribe', slideId, presentationGroupId)
            }
        }
    }, [slideId, presentationGroupId])

    // Wait socket
    useEffect(() => {
        // Xử lí -> lưu state kết quả socket trả về
        // rồi tạo useEffect với dependency là state đó
        hostSocket.on('server-send-choices', (member, choices) => {
            setNewChoices({ member, choices })
        })
        return () => {
            hostSocket.off('server-send-choices')
        }
    }, []) // Khi sử dụng socket.on thì bắt buộc phải để empty dependency

    // Xử lí cập nhật data
    useEffect(() => {
        if (newChoices) {
            const newData = { ...data.data }
            newChoices.choices.forEach((addChoice) => {
                const index = newData.choices.findIndex(
                    (choice) => choice.id.toString() === addChoice.toString()
                )
                if (index > -1) {
                    newData.choices[index].user_choices.push({
                        id: new Date(),
                        choice_id: addChoice,
                        member_id: newChoices.member.id,
                        created_at: new Date(),
                        member: newChoices.member,
                    })
                }
            })
            set({ ...data, data: newData })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newChoices])
    //#endregion

    if (isLoading) return <CLoading />
    return (
        <div className="animate-[show-slow_0.5s_ease-in]">
            <h1 className="absolute top-20 px-6 text-center text-[3.5rem] font-medium">
                {data.data.question}?
            </h1>
            <Bar options={options} data={slide.data} />
            <div
                className="absolute bottom-12 right-10 flex cursor-pointer items-center rounded-lg bg-gray-600 px-2 py-1 shadow-lg hover:bg-gray-300 hover:text-black"
                onClick={() => {
                    setIsResultModalOpen(true)
                }}
            >
                <Bars3CenterLeftIcon className="mr-3 h-8 w-8" />
                <span>Records</span>
            </div>
            {isResultModalOpen && (
                <MResultsModal
                    isOpen={isResultModalOpen}
                    onClose={() => setIsResultModalOpen(false)}
                    choices={data.data.choices}
                />
            )}
        </div>
    )
}

export default MHostMultipleChoice
