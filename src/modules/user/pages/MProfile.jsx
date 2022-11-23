import { getById } from 'common/queries-fn/users.query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MProfile() {
    //const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const { data: _data, isLoading } = getById(JSON.parse(localStorage.getItem('user')).id)
    const user = useMemo(() => _data?.data?.data ?? {}, [_data])
    const navigate = useNavigate()
    return (
        <div className="flex h-[70vh] w-full items-center justify-center rounded-[12px]">
            <div className="flex h-2/4 w-[550px] items-center justify-center rounded-lg bg-white shadow-xl">
                <div className="photo-wrapper pr-14.5">
                    <img
                        className="mx-auto h-40 w-40 rounded-full"
                        src={user?.image}
                        alt={user?.name}
                    />
                </div>
                <div className="p-3">
                    <h3 className="flex-1 text-center text-xl font-medium leading-8 text-gray-900">
                        {user?.name}
                    </h3>
                    <table className="my-3 text-base">
                        <tbody>
                            <tr>
                                
                                <td className="px-2 py-2 text-gray-500">
                                    <b>Email:</b>
                                </td>
                                <td className="px-2 py-2">{user?.email}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 text-gray-500">
                                    <b>Phone:</b>
                                </td>
                                <td className="px-2 py-2">{user?.phone ?? 'None'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="my-3 text-center">
                        <a
                            onClick={() => {navigate('edit')}}
                            className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Edit profile
                        </a>
                        <a
                            href=""
                            className="ml-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Change password
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MProfile
