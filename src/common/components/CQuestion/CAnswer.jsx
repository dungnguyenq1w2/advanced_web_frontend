import { Avatar, Tooltip } from 'flowbite-react'
import moment from 'moment'
import React from 'react'

function CAnswer({ answer, me }) {
    const isMe = parseInt(answer.user.id) === parseInt(me.id)

    return (
        <div className={`flex items-start pt-2`}>
            <Avatar img={answer.user ? answer.user.image : null} rounded={true} />
            <div className={`flex`}>
                <div className={`flex max-w-[350px] flex-col rounded-xl py-2 px-4`}>
                    <span className={`mb-1 flex text-xs font-semibold text-sky-600`}>
                        {answer.user ? answer.user.name : 'Anonymous'} {isMe && '(me)'}
                    </span>
                    <p className={`flex text-xs `}>{answer.content}</p>
                    <div className="flex justify-end">
                        <span className={`flex cursor-default text-xs text-gray-600`}>
                            <Tooltip
                                content={moment(answer.created_at)
                                    .utc()
                                    .format('hh:mm:ss MM/DD/YY')}
                                placement="right"
                                className="text-[10px]"
                            >
                                {moment(answer.created_at).utc().fromNow()}
                            </Tooltip>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CAnswer
