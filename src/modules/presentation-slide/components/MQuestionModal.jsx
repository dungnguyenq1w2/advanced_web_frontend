import 'modules/presentation-slide/assets/style/index.css'

import CModal from 'common/components/CModal'

import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { Avatar, Tooltip } from 'flowbite-react'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { HandThumbUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import MAnswer from './MAnswer'

const data = [
    {
        id: 1,
        content: 'test 1',
        vote: 1,
        is_marked: false,
        created_at: '2022-12-28T09:31:41.000Z',
        user: {
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
        user: {
            id: 1,
            name: 'Dũng 1',
            image: null,
        },
        answers: [
            {
                id: 1,
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                created_at: '2022-12-28T09:31:41.000Z',
                user: {
                    id: 2,
                    name: 'Dũng 2',
                    image: null,
                },
            },
            {
                id: 2,
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                created_at: '2022-12-28T09:31:41.000Z',
                user: {
                    id: 2,
                    name: 'Dũng 2',
                    image: null,
                },
            },
        ],
    },
    {
        id: 3,
        content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus itaque odio, incidunt eveniet maiores amet autem enim labore aliquam corporis totam officia omnis porro, earum suscipit, consequuntur alias? Possimus, sapiente!',
        is_marked: true,
        vote: 10,
        created_at: '2022-12-28T09:31:41.000Z',
        user: {
            id: 27,
            name: 'Dũng Nguyễn',
            image: null,
        },
        answers: [
            {
                id: 1,
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                created_at: '2022-12-28T09:31:41.000Z',
                user: {
                    id: 2,
                    name: 'Dũng 2',
                    image: null,
                },
            },
            {
                id: 2,
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                created_at: '2022-12-28T09:31:41.000Z',
                user: {
                    id: 1,
                    name: 'Dũng 1',
                    image: null,
                },
            },
            {
                id: 3,
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                created_at: '2022-12-28T09:31:41.000Z',
                user: {
                    id: 2,
                    name: 'Dũng 2',
                    image: null,
                },
            },
        ],
    },
    {
        id: 4,
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, numquam!',
        vote: 1,
        is_marked: true,
        created_at: '2022-12-28T09:31:41.000Z',
        user: {
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
        user: {
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
        user: {
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
        user: {
            id: 1,
            name: 'Dũng 1',
            image: null,
        },
    },
]
const MQuestionModal = ({ isOpen, onClose }) => {
    //#region data
    const [question, setQuestion] = useState('')
    const [replyQuestion, setReplyQuestion] = useState(null)
    const [isOpenAnswers, setisOpenAnswers] = useState({})

    const me = useMemo(() => JSON.parse(localStorage.getItem('user')), [])
    //#endregion

    //#region event
    const handleUpvote = (questionId) => {}
    const handleOpenAnswers = (questionId) => () => {
        setisOpenAnswers((cur) => ({
            ...cur,
            [questionId]: cur[questionId] ? !cur[questionId] : true,
        }))
    }
    //#endregion

    return (
        <>
            <CModal title="Question" isOpen={isOpen} onClose={onClose}>
                <div className="h-[550px] overflow-auto">
                    {data.map((question) => {
                        const isMe = parseInt(question.user.id) === parseInt(me.id)

                        return (
                            <div
                                key={question.id}
                                className={`relative my-2 flex items-start ${
                                    isMe ? 'flex-row-reverse' : ''
                                }`}
                            >
                                <Avatar
                                    img={question.user ? question.user.image : null}
                                    rounded={true}
                                    className="mx-3"
                                />
                                <div className={`flex ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <div
                                        className={`relative flex max-w-[350px] flex-col rounded-xl  py-2 px-4 ${
                                            isMe ? 'bg-green-100' : 'bg-gray-100'
                                        }`}
                                    >
                                        <span
                                            className={`mb-1 flex text-xs font-semibold ${
                                                isMe ? 'justify-end text-blue-600' : 'text-sky-600'
                                            }`}
                                        >
                                            {question.user ? question.user.name : 'Anonymous'}
                                        </span>
                                        <p className={`flex text-sm ${isMe ? 'justify-end' : ''}`}>
                                            {question.content}
                                        </p>
                                        {/* Controls of question */}
                                        <div
                                            className={`flex items-center justify-between ${
                                                isMe ? 'flex-row-reverse' : ''
                                            }`}
                                        >
                                            <div
                                                className={`${isMe ? 'ml-3' : 'mr-3'} flex gap-1 `}
                                            >
                                                <button
                                                    className="text-xs text-blue-600 hover:underline hover:underline-offset-1"
                                                    onClick={() => setReplyQuestion(question)}
                                                >
                                                    Reply
                                                </button>
                                                {!isMe && (
                                                    <>
                                                        <span className="mx-1 text-xs text-blue-600">
                                                            |
                                                        </span>
                                                        <button
                                                            className="text-xs text-blue-600 hover:underline hover:underline-offset-1"
                                                            onClick={handleUpvote(question.id)}
                                                        >
                                                            Upvote
                                                        </button>
                                                        <span className="mx-1 text-xs text-blue-600">
                                                            |
                                                        </span>
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
                                                    </>
                                                )}
                                            </div>

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
                                        {/* Vote number */}
                                        {question.vote > 0 && (
                                            <span
                                                className={`absolute top-1 flex items-center rounded-full bg-blue-200 p-1 text-xs font-medium text-[#0c1ae0] ${
                                                    isMe ? 'left-1' : 'right-1'
                                                }`}
                                            >
                                                <HandThumbUpIcon className="mr-1 h-4 w-4" />
                                                {question.vote}
                                            </span>
                                        )}
                                        {/* Answers of this question */}
                                        {question?.answers?.length && (
                                            <div className="mt-2 flex justify-center border-t pt-2">
                                                <span
                                                    className="cursor-pointer text-xs font-medium text-[#0c1ae0]"
                                                    onClick={handleOpenAnswers(question.id)}
                                                >
                                                    {question.answers.length} replies
                                                </span>
                                            </div>
                                        )}
                                        {isOpenAnswers[question.id] && (
                                            <div className="mt-2">
                                                {question.answers.map((answer) => (
                                                    <MAnswer
                                                        key={answer.id}
                                                        answer={answer}
                                                        me={me}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* Question input */}
                <div>
                    {/* Reply section */}
                    {replyQuestion && (
                        <div className="border-t px-3 py-1">
                            <div className="flex justify-between">
                                <span className="text-xs">
                                    Reply to{' '}
                                    <span className="font-semibold">{replyQuestion.user.name}</span>
                                </span>
                                <XMarkIcon
                                    className="h-4 w-4 cursor-pointer"
                                    onClick={() => setReplyQuestion(null)}
                                />
                            </div>
                            <p className={`truncate pr-10 text-xs`}>{replyQuestion.content}</p>
                        </div>
                    )}

                    {/* Input control */}
                    <div className="flex items-center bg-blue-50 py-2 pr-2">
                        <input
                            type="text"
                            className="w-full border-none bg-transparent px-5 text-sm outline-none focus:outline-none focus:ring-transparent"
                            placeholder={
                                replyQuestion
                                    ? `Reply to ${replyQuestion.user.name}`
                                    : 'Ask a question'
                            }
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <PaperAirplaneIcon className="h-7 w-7 text-blue-600" />
                    </div>
                </div>
            </CModal>
        </>
    )
}

export default MQuestionModal
