import { Avatar } from 'flowbite-react'
import moment from 'moment'

function MAnswer({ answer, me }) {
    const isMe = parseInt(answer.user.id) === parseInt(me.id)

    return (
        <div className={`flex animate-[pulse-once_1s_ease-in] items-start px-2 pt-2`}>
            <Avatar img={answer.user ? answer.user.image : null} rounded={true} />
            <div className={`flex`}>
                <div className={`flex max-w-[350px] flex-col rounded-xl py-2 px-4`}>
                    <span className={`mb-1 flex text-xs font-semibold text-sky-600`}>
                        {answer.user ? answer.user.name : 'Anonymous'} {isMe && '(me)'}
                    </span>
                    <p className={`flex text-xs `}>{answer.content}</p>
                    <div className="flex justify-end">
                        <span className={`flex cursor-default text-xs text-gray-600`}>
                            {moment(answer.created_at).utc().fromNow()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MAnswer
