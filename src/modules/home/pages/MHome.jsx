import { Link } from 'react-router-dom'

import group from 'assets/images/group.jpg'
import presentation from 'assets/images/presentation.png'

function MHome() {
    return (
        <div className="flex justify-center pt-20">
            <div className="rounded border bg-white p-5">
                <h1 className="text-center text-2xl">Start by creating your first presentation</h1>
                <div className="my-5 flex justify-center">
                    <div className="mr-1 flex h-52 flex-[0.5] flex-col items-center justify-between rounded-xl border pb-2 text-center hover:border-gray-400">
                        <img
                            className="h-24 w-full rounded-t-xl object-cover"
                            src={presentation}
                            alt="presentation"
                        />
                        <div>
                            <h2 className="font-semibold text-gray-800">Presentation</h2>
                            <p className="text-xs text-gray-700">Choose the best option</p>
                        </div>
                        <Link to="/presentation/create">
                            <button className="rounded bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                                Create presentation
                            </button>
                        </Link>
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
        </div>
    )
}

export default MHome
