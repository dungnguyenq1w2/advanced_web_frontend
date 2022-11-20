import React, { useEffect, useMemo } from 'react'
import { getAll as getAllGroup } from 'common/queries-fn/groups.query'
import CLoading from 'common/components/CLoading'
import { ROLE } from 'common/components/constant'
import { FireIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

function MGroupList() {
    const { data, isLoading, refetch } = getAllGroup({}, false, { staleTime: 0 })
    console.log(data)
    // useEffect(() => {
    //     refetch()
    // }, [])

    // const groups = useMemo(() => data?.data?.data ?? [], [data])
    const groups = useMemo(() => data?.data?.data ?? [], [data])
    if (isLoading) {
        return <CLoading />
    }

    return (
        <div className="container mx-auto grid grid-cols-2 gap-2">
            {groups.map((group) => {
                if (group.hasOwnProperty('my_role')) {
                    return (
                        <Link to={`/group/${group.id}`} key={group.id}>
                            <div
                                className="my-4 mx-4 overflow-hidden rounded bg-white shadow-lg"
                                // onClick={}
                            >
                                <div className="px-6 py-4">
                                    <div className="mb-2 text-xl font-bold">{group.name}</div>
                                    <p className="text-base text-gray-700">{group.description}</p>
                                    <div className="text-md mb-2 flex items-center">
                                        <FireIcon className="mr-2 h-5 w-5" />
                                        You are {ROLE[group.my_role]} of this group
                                        {/* {ROLE[group.my_role]} */}
                                    </div>
                                    <div className="text-md mb-2 flex items-center">
                                        <UserGroupIcon className="mr-2 h-5 w-5" />
                                        {group.group_size} participants
                                    </div>
                                </div>
                                <div className="px-6 pt-4 pb-2">
                                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                                        #photography
                                    </span>
                                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                                        #travel
                                    </span>
                                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                                        #fall
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )
                } else {
                    return <div key={group.id}></div>
                }
            })}
        </div>
    )
}
// {/* <div key={group.id}>
//     <p>{group.name}</p>
//     <p>{group.description}</p>
// </div> */}

export default MGroupList
