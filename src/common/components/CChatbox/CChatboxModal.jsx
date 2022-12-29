import 'modules/presentation-slide/assets/style/index.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import CModal from 'common/components/CModal'

import { Avatar, Tooltip } from 'flowbite-react'
import moment from 'moment'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { getAll } from 'common/queries-fn/messge.query'
import CLoading from '../CLoading'

// const data = [
//     {
//         id: 1,
//         content: 'test 1',
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 3,
//             name: 'Dũng 3',
//             image: null,
//         },
//     },
//     {
//         id: 2,
//         content: 'test 2',
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 1,
//             name: 'Dũng 1',
//             image: null,
//         },
//     },
//     {
//         id: 3,
//         content:
//             'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus itaque odio, incidunt eveniet maiores amet autem enim labore aliquam corporis totam officia omnis porro, earum suscipit, consequuntur alias? Possimus, sapiente!',
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 27,
//             name: 'Dũng Nguyễn',
//             image: null,
//         },
//     },
//     {
//         id: 4,
//         content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, numquam!',
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 27,
//             name: 'Dũng Nguyễn',
//             image: null,
//         },
//     },
//     {
//         id: 5,
//         content: 'Lorem ipsum dolor sit amet.',
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 28,
//             name: 'Dũng Nguyễn 11',
//             image: null,
//         },
//     },
//     {
//         id: 6,
//         content:
//             'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum aperiam tenetur perferendis rerum, laudantium vitae.',
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 2,
//             name: 'Dũng 2',
//             image: null,
//         },
//     },
//     {
//         id: 7,
//         content: 'Lorem ipsum dolor sit amet.',
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 1,
//             name: 'Dũng 1',
//             image: null,
//         },
//     },
// ]

const AlwaysScrollToBottom = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView(), [])
    return <div ref={elementRef} />
}

const CChatboxModal = ({ isOpen, onClose, presentationId, presentationGroupId }) => {
    //#region data
    // const messageRef = useRef(null)
    const scrollToBottomRef = useRef(null)
    const [message, setMessage] = useState('')
    const me = useMemo(() => JSON.parse(localStorage.getItem('user')), [])

    const {
        data: _data,
        isLoading,
        set,
    } = getAll({
        presentationId,
        presentationGroupId,
    })

    const data = useMemo(
        () =>
            _data?.data
                ? _data.data.reduce(
                      (item, cur) => {
                          if (typeof item.last === 'undefined' || item.last !== cur.user.id) {
                              item.last = cur.user.id
                              item.arr.push([])
                          }
                          item.arr[item.arr.length - 1].push(cur)
                          return item
                      },
                      { arr: [] }
                  )
                : [],
        [_data]
    )
    //#endregion

    //#region event
    // useEffect(() => {
    //     if (messageRef) {
    //         messageRef.current.addEventListener('DOMNodeInserted', (event) => {
    //             const { currentTarget: target } = event
    //             target.scroll({ top: target.scrollHeight, behavior: 'smooth' })
    //         })
    //     }
    // }, [])

    const handlePostMessage = (e) => {
        e.preventDefault()
        // api post message

        // set query
        const newData = [..._data.data]

        newData.push({
            id: new Date(),
            content: message,
            vote: 0,
            is_marked: false,
            created_at: new Date(),
            user: me,
        })
        set({ ..._data, data: newData })
        setTimeout(() => scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' }), [50])

        setMessage('')
    }
    //#endregion

    return (
        <>
            <CModal title="Chat" isOpen={isOpen} onClose={onClose}>
                <div className="h-[550px] overflow-auto">
                    {isLoading ? (
                        <CLoading />
                    ) : (
                        <>
                            <div>See more</div>
                            {data.arr.map((messages) => {
                                const isMe = parseInt(messages[0].user.id) === parseInt(me.id)

                                return (
                                    <div
                                        key={messages[0].id}
                                        className={`my-2 flex items-end ${
                                            isMe ? 'flex-row-reverse' : ''
                                        }`}
                                    >
                                        <Avatar
                                            img={messages[0].user ? messages[0].user.image : null}
                                            rounded={true}
                                            className="mx-3"
                                        />
                                        {messages.length === 1 ? (
                                            // One message
                                            <div
                                                className={`flex max-w-[350px] flex-col rounded-lg  py-2 px-4 ${
                                                    isMe ? 'bg-green-100' : 'bg-gray-100'
                                                }`}
                                            >
                                                <span
                                                    className={`mb-1 flex text-xs font-semibold ${
                                                        isMe
                                                            ? 'justify-end text-blue-600'
                                                            : 'text-sky-600'
                                                    }`}
                                                >
                                                    {messages[0].user
                                                        ? messages[0].user.name
                                                        : 'Anonymous'}
                                                </span>
                                                <p
                                                    className={`flex text-sm ${
                                                        isMe ? 'justify-end' : ''
                                                    }`}
                                                >
                                                    {messages[0].content}
                                                </p>
                                                <span
                                                    className={`flex cursor-default text-xs text-gray-600 ${
                                                        isMe ? 'items-start' : 'justify-end'
                                                    }`}
                                                >
                                                    <Tooltip
                                                        content={moment(messages[0].created_at)
                                                            .utc()
                                                            .format('hh:mm:ss MM/DD/YY')}
                                                        placement={isMe ? 'left' : 'right'}
                                                        className="text-[10px]"
                                                    >
                                                        {moment(messages[0].created_at)
                                                            .utc()
                                                            .fromNow()}
                                                    </Tooltip>
                                                </span>
                                            </div>
                                        ) : (
                                            // Group messages
                                            <div className={`flex flex-col items-end rounded-lg`}>
                                                {messages.map((message, index) => (
                                                    <div
                                                        key={message.id}
                                                        className={`my-0.5 inline-block max-w-[350px] flex-col py-2 px-4 ${
                                                            index === 0
                                                                ? isMe
                                                                    ? 'rounded-t-lg rounded-bl-lg bg-green-100'
                                                                    : 'rounded-t-lg rounded-br-lg bg-gray-100'
                                                                : isMe
                                                                ? 'rounded-l-lg bg-green-100'
                                                                : 'rounded-r-lg bg-gray-100'
                                                        }`}
                                                    >
                                                        {index === 0 && (
                                                            <span
                                                                className={`mb-1 flex text-xs font-semibold ${
                                                                    isMe
                                                                        ? 'justify-end text-blue-600'
                                                                        : 'text-sky-600'
                                                                }`}
                                                            >
                                                                {message.user
                                                                    ? message.user.name
                                                                    : 'Anonymous'}
                                                            </span>
                                                        )}

                                                        <p
                                                            className={` flex text-sm ${
                                                                isMe ? 'justify-end' : ''
                                                            }`}
                                                        >
                                                            {message.content}
                                                        </p>
                                                        <span
                                                            className={` inline-flex cursor-default text-xs text-gray-600 ${
                                                                isMe ? 'items-start' : 'justify-end'
                                                            }`}
                                                        >
                                                            <Tooltip
                                                                content={moment(message.created_at)
                                                                    .utc()
                                                                    .format('hh:mm:ss MM/DD/YY')}
                                                                placement={isMe ? 'left' : 'right'}
                                                                className="text-[10px]"
                                                            >
                                                                {moment(message.created_at)
                                                                    .utc()
                                                                    .fromNow()}
                                                            </Tooltip>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            <AlwaysScrollToBottom />
                        </>
                    )}
                    <div ref={scrollToBottomRef} />
                </div>

                {/* Form control */}
                <div>
                    <form
                        onSubmit={handlePostMessage}
                        className="flex items-center bg-blue-50 py-2 pr-2"
                    >
                        <input
                            type="text"
                            className="w-full border-none bg-transparent px-5 text-sm outline-none focus:outline-none focus:ring-transparent"
                            placeholder="Write a message"
                            value={message}
                            required
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit">
                            <PaperAirplaneIcon className="h-7 w-7 cursor-pointer text-blue-600" />
                        </button>
                    </form>
                </div>
            </CModal>
        </>
    )
}

export default CChatboxModal
