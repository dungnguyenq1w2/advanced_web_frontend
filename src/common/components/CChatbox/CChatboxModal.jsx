import 'modules/presentation-slide/assets/style/index.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import { getAll } from 'common/queries-fn/messge.query'
import { add as addMessage } from 'apis/message.api'

import CModal from 'common/components/CModal'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { Avatar } from 'flowbite-react'
import moment from 'moment'
import CLoading from '../CLoading'
import { v4 as uuidv4 } from 'uuid'

const AlwaysScrollToBottom = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView(), [])
    return <div ref={elementRef} />
}

const CChatboxModal = ({ isOpen, onClose, presentationId, presentationGroupId }) => {
    //#region data
    const scrollToBottomRef = useRef(null)
    const [input, setInput] = useState('')

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
    const handlePostMessage = async (e) => {
        e.preventDefault()

        const newData = [..._data.data]
        // api post message
        const res = await addMessage({
            content: input,
            presentation_id: presentationId,
            presentation_group_id: presentationGroupId,
        })
        console.log('🚀 ~ res', res)
        if (res?.data?.id) {
            // set query
            newData.push({
                id: uuidv4(),
                content: input,
                created_at: new Date(),
                user: me,
            })

            set({ ..._data, data: newData })
            setTimeout(() => scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' }), [50])
        }
        setInput('')
    }

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
                                                    {moment(messages[0].created_at).utc().fromNow()}
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
                                                            {moment(message.created_at)
                                                                .utc()
                                                                .fromNow()}
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

                <div>
                    {/* Form control */}
                    <form
                        onSubmit={handlePostMessage}
                        className="flex items-center bg-blue-50 py-2 pr-2"
                    >
                        <input
                            type="text"
                            className="w-full border-none bg-transparent px-5 text-sm outline-none focus:outline-none focus:ring-transparent"
                            placeholder="Write a message"
                            value={input}
                            required
                            onChange={(e) => setInput(e.target.value)}
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
