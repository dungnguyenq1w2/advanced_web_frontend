import 'modules/presentation-slide/assets/style/index.css'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

import { getAll } from 'common/queries-fn/question.query'
import { add as addQuestion } from 'apis/question.api'
import { add as addAnswer } from 'apis/answer.api'

import CModal from 'common/components/CModal'

import { HandThumbUpIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { Avatar, Label, Radio } from 'flowbite-react'
import moment from 'moment'
import CLoading from '../CLoading'
import CAnswer from './CAnswer'

const AlwaysScrollToBottom = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView(), [])
    return <div ref={elementRef} />
}

const CQuestionModal = ({ isOpen, onClose, presentationId, presentationGroupId }) => {
    //#region data
    // const questionRef = useRef(null)
    const scrollToBottomRef = useRef(null)
    const inputRef = useRef(null)
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
    useEffect(() => {
        inputRef.current.focus()
    }, [])

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
    }

    const handleReplyQuestion = (question) => {
        setReplyQuestion(question)
        inputRef.current.focus()
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
    const handlePostQuestion = useCallback(
        async (e) => {
            e.preventDefault()

            const newData = [..._data.data]

            // Case ANSWER the question
            if (replyQuestion) {
                const questionAnsweredIndex = newData.findIndex((e) => e.id === replyQuestion.id)
                // api post answer
                const res = await addAnswer({
                    content: input,
                    question_id: newData[questionAnsweredIndex].id,
                })
                if (res?.data?.id) {
                    // set query
                    newData[questionAnsweredIndex].answers.push({
                        id: new Date(),
                        content: input,
                        created_at: new Date(),
                        user: me,
                    })
                    setisOpenAnswers((cur) => ({ ...cur, [replyQuestion.id]: true }))
                    set({ ..._data, data: newData })
                }

                setReplyQuestion(null)
                setInput('')
            } else {
                // Case QUESTION
                // api post question
                const res = await addQuestion({
                    content: input,
                    presentation_id: presentationId,
                    presentation_group_id: presentationGroupId,
                })
                if (res?.data?.id) {
                    // set query
                    newData.push({
                        id: new Date(),
                        content: input,
                        vote: 0,
                        is_marked: false,
                        created_at: new Date(),
                        user: me,
                    })
                    setTimeout(
                        () => scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' }),
                        [50]
                    )
                }
                set({ ..._data, data: newData })
                setInput('')
            }
        },
        [_data, input, me, replyQuestion, set, presentationId, presentationGroupId]
    )
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
                                                        className={`text-xs ${
                                                            question.is_marked
                                                                ? 'text-gray-400'
                                                                : 'cursor-pointer text-blue-600 hover:underline hover:underline-offset-1'
                                                        }`}
                                                        onClick={() =>
                                                            !question?.is_marked
                                                                ? handleReplyQuestion(question)
                                                                : null
                                                        }
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
                                                    {moment(question.created_at).utc().fromNow()}
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
                                                        ? `visible mt-2 rounded-lg ${
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
                            ref={inputRef}
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
