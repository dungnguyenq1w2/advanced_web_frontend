import { useEffect, useMemo, useState } from 'react'

import { memberSocket } from 'common/socket'

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
import { Bar } from 'react-chartjs-2'
import { getRandomColor } from 'utils/func'
import MCheckbox from './MCheckbox'

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

function MMemberMultipleChoice({
    slideId,
    member,
    presentationGroupId,
    data,
    isLoading,
    set,
    isSubmitted,
    onSubmit,
}) {
    //#region Data
    // Save data from socket 'server-send-choices'
    const [newChoices, setNewChoices] = useState()
    const [permission, setPermission] = useState(false)

    const slide = useMemo(() => {
        return data?.data?.id
            ? {
                  question: data.data.question,
                  data: {
                      labels: data.data.choices.map((e) => e.content),
                      datasets: [
                          {
                              data: data.data.choices.map((e) => e.n_choices),
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
    // const { data, isLoading, set } = getSlideForHostById(slideId)

    //#endregion

    //#region Event
    // Connect socket
    useEffect(() => {
        if (slideId) {
            memberSocket.open()
            memberSocket.emit('subscribe', slideId, presentationGroupId)
        }
        return () => {
            if (slideId) {
                memberSocket.emit('unsubscribe', slideId, presentationGroupId)
            }
        }
    }, [slideId, presentationGroupId])

    // Wait socket
    useEffect(() => {
        // Xử lí -> lưu state kết quả socket trả về
        // rồi tạo useEffect với dependency là state đó

        // Check permission for host
        memberSocket.on('server-send-permission', (hostPermission) => {
            setPermission(hostPermission)
        })

        // Realtime update new choices
        memberSocket.on('server-send-choices', (member, choices) => {
            setNewChoices({ member, choices })
        })

        return () => {
            memberSocket.off('server-send-permission')
            memberSocket.off('server-send-choices')
        }
    }, []) // Khi sử dụng socket.on thì bắt buộc phải để empty dependency

    //Xử lí cập nhật data
    useEffect(() => {
        if (newChoices) {
            const newData = { ...data.data }
            newChoices.choices.forEach((addChoice) => {
                const index = newData.choices.findIndex(
                    (choice) => choice.id.toString() === addChoice.toString()
                )
                if (index > -1) {
                    newData.choices[index].n_choices += 1
                    newData.choices[index].user_choices.push('temp')
                    newData.isChosen = true
                }
            })
            set({ ...data, data: newData })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newChoices])

    // Kiểm tra member đã chọn các lựa chọn chưa
    useEffect(() => {
        if (data?.data) {
            onSubmit(data.data.isChosen)
        }
    }, [data, onSubmit])

    const handleChoiceSendSocket = (choices) => {
        memberSocket.emit('client-send-choices', slideId, presentationGroupId, member, choices)
        onSubmit(true)
    }
    //#endregion
    if (isLoading) return <CLoading />
    return (
        <>
            {!permission ? (
                <div className="flex h-full flex-col items-center justify-center">
                    <h1 className="mb-10 animate-[show-slow_2s_ease-in] px-20 text-center text-6xl">
                        Waiting for host present this slide
                    </h1>
                </div>
            ) : isSubmitted ? (
                <div className="relative animate-[show-slow_0.5s_ease-in]">
                    <Bar options={options} data={slide.data} />
                    <div
                        style={{ minWidth: '300px' }}
                        className="absolute right-20 top-40 max-h-[45rem] max-w-[20rem] rounded-lg bg-blue-900 bg-opacity-30 py-2 shadow-lg"
                    >
                        <h1 className="mb-3 py-3 text-center text-2xl font-bold">YOUR CHOICES</h1>
                        <ul>
                            {data.data.choices
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
                        choices={data?.data.choices}
                        handleChoiceSendSocket={handleChoiceSendSocket}
                    />
                </div>
            )}
        </>
    )
}

export default MMemberMultipleChoice
