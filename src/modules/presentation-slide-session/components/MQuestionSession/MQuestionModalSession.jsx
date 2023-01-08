import 'modules/presentation-slide/assets/style/index.css'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { questionSocket } from 'common/socket'

import CModal from 'common/components/CModal'

import { HandThumbUpIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Avatar, Label, Radio } from 'flowbite-react'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import MAnswer from './MAnswer'

const AlwaysScrollToBottom = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView(), [])
    return <div ref={elementRef} />
}

const MQuestionModalSession = ({ isOpen, onClose, data, set, presentationId }) => {
    //#region data
    // const questionRef = useRef(null)
    const scrollToBottomRef = useRef(null)
    const inputRef = useRef(null)
    const [input, setInput] = useState('')
    const [replyQuestion, setReplyQuestion] = useState(null)
    const [isOpenAnswers, setisOpenAnswers] = useState({})
    const [newQuestion, setNewQuestion] = useState(null)
    const [questionsData, setQuestionsData] = useState([])

    const me = useMemo(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            delete user.accessToken
            delete user.refreshToken
            delete user.email
            return user
        } else {
            const anonymous = JSON.parse(localStorage.getItem('anonymous'))
            if (anonymous) {
                return anonymous
            } else return null
        }
    }, [])

    const questions = useMemo(
        () =>
            questionsData.length > 0
                ? questionsData.map((question) => {
                      if (!question?.user)
                          return { ...question, user: { id: question.user_id, name: 'Anonynous' } }
                      else return question
                  })
                : [],
        [questionsData]
    )
    //#endregion

    //#region event
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus()
    }, [])

    useEffect(() => {
        if (data.length > 0) {
            setQuestionsData([...data])
        }
    }, [data])

    // Connect socket
    useEffect(() => {
        if (presentationId) {
            questionSocket.open()
            questionSocket.emit('subscribe', presentationId)
            questionSocket.emit('client-get-questions-session', presentationId)
        }
        return () => {
            if (presentationId) {
                questionSocket.emit('unsubscribe', presentationId)
            }
        }
    }, [presentationId])

    // Wait socket
    useEffect(() => {
        // Xử lí -> lưu state kết quả socket trả về
        // rồi tạo useEffect với dependency là state đó
        // Get all message
        questionSocket.on('server-send-questions-session', (questions) => {
            set(questions)
        })
        // Realtime update new question
        questionSocket.on('server-send-question-session', (question) => {
            setNewQuestion(question)
        })

        return () => {
            questionSocket.off('server-send-question-session')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Khi sử dụng socket.on thì bắt buộc phải để empty dependency

    //Xử lí cập nhật data
    useEffect(() => {
        if (newQuestion) {
            const newData = [...data]

            if (newQuestion.isAnswer) {
                const questionAnsweredIndex = newData.findIndex(
                    (e) => e.id === newQuestion.questionId
                )
                if (newData[questionAnsweredIndex]?.answers) {
                    // set query
                    newData[questionAnsweredIndex].answers.push({
                        id: newQuestion.id,
                        content: newQuestion.content,
                        created_at: newQuestion.created_at,
                        user: newQuestion.user,
                    })
                } else {
                    newData[questionAnsweredIndex].answers = [
                        {
                            id: newQuestion.id,
                            content: newQuestion.content,
                            created_at: newQuestion.created_at,
                            user: newQuestion.user,
                        },
                    ]
                }
            } else {
                newData.push({
                    id: newQuestion.id,
                    content: newQuestion.content,
                    created_at: newQuestion.created_at,
                    user: newQuestion.user,
                })
                setTimeout(
                    () => scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' }),
                    [50]
                )
            }

            set(newData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newQuestion])

    const handleFilterChange = (e) => {
        const newData = [...data]
        // eslint-disable-next-line array-callback-return
        const filtedData = newData.filter((question) => {
            if (e.target.value === 'all') {
                return true
            } else if (e.target.value === 'answered') {
                return question.is_marked === true
            } else if (e.target.value === 'unanswered') {
                return question.is_marked === false
            }
        })
        setQuestionsData(filtedData)
        setTimeout(() => scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' }), [50])
    }

    const handleReplyQuestion = (question) => {
        setReplyQuestion(question)
        inputRef.current.focus()
    }
    const handleUpvote = (questionId) => {
        const newData = [...data]
        const index = newData.findIndex((question) => question.id === questionId)
        if (index > -1) {
            newData[index].is_voted = true
            newData[index].vote++
            set(newData)
            questionSocket.emit('client-vote-question-session', presentationId, questionId)
        }
    }
    const handleMark = (questionId) => {
        const newData = [...data]
        const index = newData.findIndex((question) => question.id === questionId)
        if (index > -1) {
            newData[index].is_marked = true
            set(newData)
            questionSocket.emit('client-mark-question-session', presentationId, questionId)
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

            const inputValue = input.trim()

            if (!inputValue) {
                setInput('')
                return
            }

            const question = {
                id: uuidv4(),
                content: inputValue,
                created_at: new Date(),
                user: me,
                isAnswer: false,
            }
            // Case ANSWER the question
            if (replyQuestion) {
                question.isAnswer = true
                question.questionId = replyQuestion.id
                question.userAnsweredId = replyQuestion.user.id
                setisOpenAnswers((cur) => ({ ...cur, [replyQuestion.id]: true }))

                setReplyQuestion(null)
            } else {
                question.is_voted = false
                question.vote = 0
                question.is_marked = false
            }

            questionSocket.emit('client-send-question-session', presentationId, question)
            setInput('')
        },
        [input, me, replyQuestion, presentationId]
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
                    <div>See more</div>
                    {questions.map((question) => {
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
                                    title={moment(question.created_at)
                                        .locale('vi')
                                        .format('hh:mm DD/MM/YY')}
                                >
                                    <span
                                        className={`mb-1 flex text-xs font-semibold ${
                                            isMe
                                                ? `justify-end text-blue-600 ${
                                                      question.vote > 0 ? 'pl-10' : ''
                                                  }`
                                                : 'text-sky-600'
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
                                            className={`${
                                                isMe ? 'ml-3 flex-row-reverse' : 'mr-3'
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
                                                        {question.is_voted ? 'Upvoted' : 'Upvote'}
                                                    </span>
                                                </>
                                            )}
                                            <span className="mx-1 text-xs text-blue-600">|</span>
                                            <span
                                                className={`text-xs ${
                                                    question.is_marked
                                                        ? 'text-gray-400'
                                                        : `cursor-pointer text-blue-600 hover:underline hover:underline-offset-1 ${
                                                              isMe ? 'hidden' : 'visible'
                                                          }`
                                                }`}
                                                onClick={() =>
                                                    !question?.is_marked
                                                        ? handleMark(question.id)
                                                        : null
                                                }
                                            >
                                                {question.is_marked ? 'Marked' : 'Mark'}
                                            </span>
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
                                    {question?.answers?.length > 0 && (
                                        <div className={`mt-2 flex justify-center border-t pt-2`}>
                                            <span
                                                className="cursor-pointer text-xs font-medium text-[#0c1ae0]"
                                                onClick={handleOpenAnswers(question.id)}
                                            >
                                                {question?.answers?.length}{' '}
                                                {question?.answers?.length > 1
                                                    ? 'replies'
                                                    : 'reply'}
                                            </span>
                                        </div>
                                    )}
                                    {isOpenAnswers[question.id] && (
                                        <div
                                            className={`mt-2 rounded-lg ${
                                                isMe ? 'bg-green-50 bg-opacity-80' : 'bg-slate-50'
                                            }
                                                `}
                                        >
                                            {question?.answers?.map((answer) => (
                                                <MAnswer key={answer.id} answer={answer} me={me} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    <AlwaysScrollToBottom />

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

export default MQuestionModalSession
