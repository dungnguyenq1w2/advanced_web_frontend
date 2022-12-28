import 'modules/presentation-slide/assets/style/index.css'

import CModal from 'common/components/CModal'

import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { Avatar, Tooltip } from 'flowbite-react'
import moment from 'moment'
import { useMemo, useState } from 'react'

const data = [
    {
        id: 1,
        content: 'test 1',
        vote: 1,
        is_marked: false,
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
        vote: 0,
        is_marked: false,
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
        is_marked: true,
        vote: 10,
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
        vote: 1,
        is_marked: true,
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
        vote: 1,
        is_marked: true,
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
        vote: 1,
        is_marked: true,
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
        vote: 1,
        is_marked: true,
        created_at: '2022-12-28T09:31:41.000Z',
        member: {
            id: 1,
            name: 'Dũng 1',
            image: null,
        },
    },
]
const MQuestionModal = ({ isOpen, onClose }) => {
    //#region data
    const [question, setQuestion] = useState('')
    const me = useMemo(() => JSON.parse(localStorage.getItem('user')), [])
    //#endregion

    //#region event
    //#endregion

    return (
        <>
            <CModal title="Question" isOpen={isOpen} onClose={onClose}>
                <div className="h-[550px] overflow-auto">
                    {data.map((question) => {
                        const isMe = parseInt(question.member.id) === parseInt(me.id)

                        return (
                            <div
                                className={`my-2 flex items-end ${isMe ? 'flex-row-reverse' : ''}`}
                            >
                                <Avatar
                                    img={question.member ? question.member.image : null}
                                    rounded={true}
                                    className="mx-3"
                                />
                                <div
                                    className={`flex items-center ${
                                        isMe ? 'flex-row-reverse' : ''
                                    }`}
                                >
                                    <div
                                        className={`flex max-w-[300px] flex-col rounded-xl  py-2 px-4 ${
                                            isMe ? 'bg-green-100' : 'bg-gray-100'
                                        }`}
                                    >
                                        <span
                                            className={`mb-1 flex text-xs font-semibold ${
                                                isMe ? 'justify-end text-blue-600' : 'text-sky-600'
                                            }`}
                                        >
                                            {question.member ? question.member.name : 'Anonymous'}
                                        </span>
                                        <p className={`flex text-sm ${isMe ? 'justify-end' : ''}`}>
                                            {question.content}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            {isMe ? (
                                                <div className="mr-3 flex gap-1">
                                                    <button className="text-xs text-blue-600 hover:underline hover:underline-offset-1">
                                                        Reply
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mr-3 flex gap-1">
                                                    <button className="text-xs text-blue-600 hover:underline hover:underline-offset-1">
                                                        Reply
                                                    </button>
                                                    <button className="text-xs text-blue-600 hover:underline hover:underline-offset-1">
                                                        Upvote
                                                    </button>
                                                    <button
                                                        className={`text-xs ${
                                                            question.is_marked
                                                                ? 'text-gray-400'
                                                                : 'text-blue-600 hover:underline hover:underline-offset-1'
                                                        }`}
                                                        disabled={question.is_marked}
                                                    >
                                                        {question.is_marked ? 'Marked' : 'Mark'}
                                                    </button>
                                                    {/* <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 rounded-full border p-1" /> */}
                                                    {/* <CheckIcon className="h-6 w-6 rounded-full border p-1" /> */}
                                                    {/* <ChevronUpIcon className="h-6 w-6 rounded-full border p-1" /> */}
                                                </div>
                                            )}

                                            <span
                                                className={`flex cursor-default text-xs text-gray-600 ${
                                                    isMe ? 'items-start' : 'justify-end'
                                                }`}
                                            >
                                                <Tooltip
                                                    content={moment(question.created_at)
                                                        .utc()
                                                        .format('hh:mm:ss MM/DD/YY')}
                                                    placement={isMe ? 'left' : 'right'}
                                                    className="text-[10px]"
                                                >
                                                    {moment(question.created_at).utc().fromNow()}
                                                </Tooltip>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center bg-blue-50 py-2 pr-2">
                    <input
                        type="text"
                        className="w-full border-none bg-transparent px-5 text-sm outline-none focus:outline-none focus:ring-transparent"
                        placeHolder="Ask a question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <PaperAirplaneIcon className="h-7 w-7 text-blue-600" />
                </div>
            </CModal>
        </>
    )
}

export default MQuestionModal
