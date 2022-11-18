import { Button } from 'flowbite-react'
import poll from 'assets/images/poll.jpg'
import group from 'assets/images/group.jpg'
import { Link } from 'react-router-dom'
import { getAll as getAllGroup } from 'common/queries-fn/groups.query'

function MHome() {
    // const { data, isLoading } = getAllGroup()

    return (
        <div className="flex justify-center pt-20">
            <div className="rounded border bg-white p-5">
                <h1 className="text-center text-2xl">Start by creating your first Poll</h1>
                <div className="my-5 flex justify-center">
                    <div className="mr-1 flex h-52 flex-[0.5] flex-col items-center justify-between rounded-xl border pb-2 text-center hover:border-gray-400">
                        <img
                            className="h-24 w-full rounded-t-xl object-cover"
                            src={poll}
                            alt="poll"
                        />
                        <div>
                            <h2 className="font-semibold text-gray-800">Realtime Poll</h2>
                            <p className="text-xs text-gray-700">Choose the best option</p>
                        </div>
                        <button className="rounded bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                            Create poll
                        </button>
                    </div>
                    <div className="ml-1 flex h-52 flex-[0.5] flex-col items-center justify-between rounded-xl border pb-2 text-center hover:border-gray-400">
                        <img
                            className="h-24 w-full rounded-t-xl object-cover"
                            src={group}
                            alt="group"
                        />
                        <div>
                            <h2 className="font-semibold text-gray-800">Group</h2>
                            <p className="text-xs text-gray-700">Find the best time to meet</p>
                        </div>
                        <Link to="/group/create">
                            <button className="rounded bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                                Create group
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="border border-dashed bg-gray-50 p-2">
                    <h1>All your invites and events will show up here once you get started.</h1>
                </div>
            </div>
            <div className="ml-1 rounded border bg-white p-5">
                <h1 className="text-base font-semibold">My groups</h1>
            </div>
        </div>
    )
}

export default MHome
