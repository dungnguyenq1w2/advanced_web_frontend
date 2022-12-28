import 'modules/presentation-slide/assets/style/index.css'

import { useMemo, useState } from 'react'

import CModal from 'common/components/CModal'

import { Avatar, Tooltip } from 'flowbite-react'
import moment from 'moment'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

const data = [
    {
        id: 1,
        content: 'test 1',
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 3,
            name: 'Dũng 3',
            image: null,
        },
    },
    {
        id: 2,
        content: 'test 2',
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 1,
            name: 'Dũng 1',
            image: null,
        },
    },
    {
        id: 3,
        content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus itaque odio, incidunt eveniet maiores amet autem enim labore aliquam corporis totam officia omnis porro, earum suscipit, consequuntur alias? Possimus, sapiente!',
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 27,
            name: 'Dũng Nguyễn',
            image: null,
        },
    },
    {
        id: 4,
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, numquam!',
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 27,
            name: 'Dũng Nguyễn',
            image: null,
        },
    },
    {
        id: 5,
        content: 'Lorem ipsum dolor sit amet.',
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 28,
            name: 'Dũng Nguyễn 11',
            image: null,
        },
    },
    {
        id: 6,
        content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum aperiam tenetur perferendis rerum, laudantium vitae.',
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 2,
            name: 'Dũng 2',
            image: null,
        },
    },
    {
        id: 7,
        content: 'Lorem ipsum dolor sit amet.',
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 1,
            name: 'Dũng 1',
            image: null,
        },
    },
]

const CChatboxModal = ({ isOpen, onClose }) => {
    //#region data
    const [message, setMessage] = useState('')
    const me = useMemo(() => JSON.parse(localStorage.getItem('user')), [])
    //#endregion

    //#region event
    //#endregion

    return (
        <>
            <CModal title="Chat" isOpen={isOpen} onClose={onClose}>
                <div className="h-[550px] overflow-auto">
                    {data.map((message) => {
                        const isMe = parseInt(message.member.id) === parseInt(me.id)

                        return (
                            <div
                                key={message.id}
                                className={`my-2 flex items-start ${
                                    isMe ? 'flex-row-reverse' : ''
                                }`}
                            >
                                <Avatar
                                    img={message.member ? message.member.image : null}
                                    rounded={true}
                                    className="mx-3"
                                />
                                <div
                                    className={`flex max-w-[350px] flex-col rounded-xl  py-2 px-4 ${
                                        isMe ? 'bg-green-100' : 'bg-gray-100'
                                    }`}
                                >
                                    <span
                                        className={`mb-1 flex text-xs font-semibold ${
                                            isMe ? 'justify-end text-blue-600' : 'text-sky-600'
                                        }`}
                                    >
                                        {message.member ? message.member.name : 'Anonymous'}
                                    </span>
                                    <p className={`flex text-sm ${isMe ? 'justify-end' : ''}`}>
                                        {message.content}
                                    </p>
                                    <span
                                        className={`flex cursor-default text-xs text-gray-600 ${
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
                                            {moment(message.created_at).utc().fromNow()}
                                        </Tooltip>
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center bg-blue-50 py-2 pr-2">
                    <input
                        type="text"
                        className="w-full border-none bg-transparent px-5 text-sm outline-none focus:outline-none focus:ring-transparent"
                        placeholder="Write a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <PaperAirplaneIcon className="h-7 w-7 text-blue-600" />
                </div>
            </CModal>
        </>
    )
}

export default CChatboxModal
