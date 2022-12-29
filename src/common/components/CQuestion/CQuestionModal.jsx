import 'modules/presentation-slide/assets/style/index.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import CModal from 'common/components/CModal'

import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { HandThumbUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Avatar, Label, Radio, Tooltip } from 'flowbite-react'
import moment from 'moment'
import CAnswer from './CAnswer'
import { getAll } from 'common/queries-fn/question.query'
import CLoading from '../CLoading'

// const data = [
//     {
//         id: 1,
//         content: 'test 1',
//         vote: 1,
//         is_marked: false,
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
//         vote: 0,
//         is_marked: false,
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 1,
//             name: 'Dũng 1',
//             image: null,
//         },
//         answers: [
//             {
//                 id: 1,
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
//                 created_at: '2022-12-28T09:31:41.000Z',
//                 user: {
//                     id: 2,
//                     name: 'Dũng 2',
//                     image: null,
//                 },
//             },
//             {
//                 id: 2,
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
//                 created_at: '2022-12-28T09:31:41.000Z',
//                 user: {
//                     id: 2,
//                     name: 'Dũng 2',
//                     image: null,
//                 },
//             },
//         ],
//     },
//     {
//         id: 3,
//         content:
//             'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus itaque odio, incidunt eveniet maiores amet autem enim labore aliquam corporis totam officia omnis porro, earum suscipit, consequuntur alias? Possimus, sapiente!',
//         is_marked: true,
//         vote: 10,
//         created_at: '2022-12-28T09:31:41.000Z',
//         user: {
//             id: 27,
//             name: 'Dũng Nguyễn',
//             image: null,
//         },
//         answers: [
//             {
//                 id: 1,
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
//                 created_at: '2022-12-28T09:31:41.000Z',
//                 user: {
//                     id: 2,
//                     name: 'Dũng 2',
//                     image: null,
//                 },
//             },
//             {
//                 id: 2,
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
//                 created_at: '2022-12-28T09:31:41.000Z',
//                 user: {
//                     id: 1,
//                     name: 'Dũng 1',
//                     image: null,
//                 },
//             },
//             {
//                 id: 3,
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
//                 created_at: '2022-12-28T09:31:41.000Z',
//                 user: {
//                     id: 2,
//                     name: 'Dũng 2',
//                     image: null,
//                 },
//             },
//         ],
//     },
//     {
//         id: 4,
//         content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, numquam!',
//         vote: 1,
//         is_marked: true,
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
//         vote: 1,
//         is_marked: true,
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
//         vote: 1,
//         is_marked: true,
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
//         vote: 1,
//         is_marked: true,
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

const CQuestionModal = ({ isOpen, onClose, presentationId, presentationGroupId }) => {
    //#region data
    // const questionRef = useRef(null)
    const scrollToBottomRef = useRef(null)
    const [filter, setFilter] = useState('all')
    const [input, setInput] = useState('')
    const [replyQuestion, setReplyQuestion] = useState(null)
    const [isOpenAnswers, setisOpenAnswers] = useState({})

    const me = useMemo(() => JSON.parse(localStorage.getItem('user')), [])

    const {
        data: _data,
        isLoading,
        set,
    } = getAll({
        filter,
        presentationId,
        presentationGroupId,
    })

    const data = useMemo(() => _data?.data ?? [], [_data])
    //#endregion

    //#region event
    // useEffect(() => {
    //     if (questionRef) {
    //         questionRef.current.addEventListener('DOMNodeInserted', async (event) => {
    //             const { currentTarget: target } = event
    //             await target.scroll({ top: target.scrollHeight, behavior: 'smooth' })
    //         })
    //     }
    // }, [])

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
    }
    const handleUpvote = (questionId) => {
        const newData = [...data]
        const index = newData.findIndex(
            (question) => parseInt(question.id) === parseInt(questionId)
        )
        if (index > -1) {
            newData[index].is_voted = true
            newData[index].vote++
            set({ ..._data, data: newData })
        }
    }
    const handleMark = (questionId) => {
        const newData = [...data]
        const index = newData.findIndex(
            (question) => parseInt(question.id) === parseInt(questionId)
        )
        if (index > -1) {
            newData[index].is_marked = true
            set({ ..._data, data: newData })
        }
    }
    const handleOpenAnswers = (questionId) => () => {
        setisOpenAnswers((cur) => ({
            ...cur,
            [questionId]: cur[questionId] ? !cur[questionId] : true,
        }))
    }
    const handlePostQuestion = async (e) => {
        e.preventDefault()

        const newData = [...data]

        // Case ANSWER the question
        if (replyQuestion) {
            // api post question

            // set query
            const questionAnsweredIndex = newData.findIndex((e) => e.id === replyQuestion.id)
            newData[questionAnsweredIndex].answers.push({
                id: new Date(),
                content: input,
                created_at: new Date(),
                user: me,
            })
            setisOpenAnswers((cur) => ({ ...cur, [replyQuestion.id]: true }))
            setReplyQuestion(null)
        } else {
            // Case QUESTION
            // api post question

            // set query
            newData.push({
                id: new Date(),
                content: input,
                vote: 0,
                is_marked: false,
                created_at: new Date(),
                user: me,
            })
            setTimeout(() => scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' }), [50])
        }

        set({ ..._data, data: newData })
        setInput('')
    }
    //#endregion

    return (
        <>
            <CModal title="Question" isOpen={isOpen} onClose={onClose}>
                {/* Filter */}
                <div className="flex justify-center py-2 shadow">
                    <legend className="mr-10 text-sm font-semibold">Filter</legend>
                    <fieldset className="flex justify-center gap-4" id="radio">
                        <div className="flex items-center gap-2">
                            <Radio
                                id="all"
                                name="filter"
                                value="all"
                                defaultChecked={true}
                                onChange={handleFilterChange}
                            />
                            <Label htmlFor="all">All</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="answered"
                                name="filter"
                                value="answered"
                                onChange={handleFilterChange}
                            />
                            <Label htmlFor="answered">Answered</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="unanswered"
                                name="filter"
                                value="unanswered"
                                onChange={handleFilterChange}
                            />
                            <Label htmlFor="unanswered">Unanswered</Label>
                        </div>
                    </fieldset>
                </div>
                <div className="h-[550px] overflow-auto">
                    {isLoading ? (
                        <CLoading />
                    ) : (
                        <>
                            <div>See more</div>
                            {data.map((question) => {
                                const isMe = parseInt(question.user.id) === parseInt(me.id)

                                return (
                                    <div
                                        key={question.id}
                                        className={`my-2 flex items-start ${
                                            isMe ? 'flex-row-reverse' : ''
                                        }`}
                                    >
                                        <Avatar
                                            img={question.user ? question.user.image : null}
                                            rounded={true}
                                            className="mx-3"
                                        />
                                        <div
                                            className={`relative flex max-w-[350px] flex-col rounded-xl  py-2 px-4 ${
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
                                                {question.user ? question.user.name : 'Anonymous'}
                                            </span>
                                            <p
                                                className={`flex text-sm ${
                                                    isMe ? 'justify-end' : ''
                                                }`}
                                            >
                                                {question.content}
                                            </p>
                                            {/* Controls of question */}
                                            <div
                                                className={`flex items-center justify-between ${
                                                    isMe ? 'flex-row-reverse' : ''
                                                }`}
                                            >
                                                <div
                                                    className={`${
                                                        isMe ? 'ml-3' : 'mr-3'
                                                    } flex gap-1 `}
                                                >
                                                    <span
                                                        className="cursor-pointer text-xs text-blue-600 hover:underline hover:underline-offset-1"
                                                        onClick={() => setReplyQuestion(question)}
                                                    >
                                                        Reply
                                                    </span>
                                                    {!isMe && (
                                                        <>
                                                            <span className="mx-1 text-xs text-blue-600">
                                                                |
                                                            </span>
                                                            <span
                                                                className={`text-xs ${
                                                                    question?.is_voted
                                                                        ? 'text-gray-400'
                                                                        : 'cursor-pointer text-blue-600 hover:underline hover:underline-offset-1'
                                                                }`}
                                                                onClick={() =>
                                                                    !question?.is_voted
                                                                        ? handleUpvote(question.id)
                                                                        : null
                                                                }
                                                            >
                                                                {question.is_voted
                                                                    ? 'Upvoted'
                                                                    : 'Upvote'}
                                                            </span>
                                                            <span className="mx-1 text-xs text-blue-600">
                                                                |
                                                            </span>
                                                            <span
                                                                className={`text-xs ${
                                                                    question.is_marked
                                                                        ? 'text-gray-400'
                                                                        : 'cursor-pointer text-blue-600 hover:underline hover:underline-offset-1'
                                                                }`}
                                                                onClick={() =>
                                                                    !question?.is_marked
                                                                        ? handleMark(question.id)
                                                                        : null
                                                                }
                                                                disabled={question.is_marked}
                                                            >
                                                                {question.is_marked
                                                                    ? 'Marked'
                                                                    : 'Mark'}
                                                            </span>
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
                                                        {moment(question.created_at)
                                                            .utc()
                                                            .fromNow()}
                                                    </Tooltip>
                                                </span>
                                            </div>

                                            {/* Vote number */}
                                            <span
                                                className={`${
                                                    question.vote > 0
                                                        ? `visible absolute top-1 flex items-center rounded-full bg-blue-200 p-1 text-xs font-medium text-[#0c1ae0] ${
                                                              isMe ? 'left-1' : 'right-1'
                                                          }`
                                                        : 'hidden'
                                                } `}
                                            >
                                                <HandThumbUpIcon className="mr-1 h-4 w-4" />
                                                {question.vote}
                                            </span>

                                            {/* Answers of this question */}
                                            <div
                                                className={`${
                                                    question?.answers?.length > 0
                                                        ? 'visible mt-2 flex justify-center border-t pt-2'
                                                        : 'hidden'
                                                }`}
                                            >
                                                <span
                                                    className="cursor-pointer text-xs font-medium text-[#0c1ae0]"
                                                    onClick={handleOpenAnswers(question.id)}
                                                >
                                                    {question?.answers?.length} replies
                                                </span>
                                            </div>

                                            <div
                                                className={`${
                                                    isOpenAnswers[question.id]
                                                        ? `visible mt-2 rounded-lg px-2 ${
                                                              isMe
                                                                  ? 'bg-green-50 bg-opacity-80'
                                                                  : 'bg-slate-50'
                                                          }`
                                                        : 'hidden'
                                                }`}
                                            >
                                                {question?.answers?.map((answer) => (
                                                    <CAnswer
                                                        key={answer.id}
                                                        answer={answer}
                                                        me={me}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <AlwaysScrollToBottom />
                        </>
                    )}
                    <div ref={scrollToBottomRef} />
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

                    {/* Form control */}
                    <form
                        onSubmit={handlePostQuestion}
                        className="flex items-center bg-blue-50 py-2 pr-2"
                    >
                        <input
                            type="text"
                            className="w-full border-none bg-transparent px-5 text-sm outline-none focus:outline-none focus:ring-transparent"
                            placeholder={
                                replyQuestion
                                    ? `Reply to ${replyQuestion.user.name}`
                                    : 'Ask a question'
                            }
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

export default CQuestionModal
