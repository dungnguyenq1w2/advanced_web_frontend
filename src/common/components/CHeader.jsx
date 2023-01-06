import { useContext, useEffect, useMemo, useState } from 'react'

import { Link, NavLink, useNavigate } from 'react-router-dom'

import { SocketContext } from 'common/socket'

import { getAll as getAllNotifications } from 'common/queries-fn/notification.query'
import { logout } from 'apis/auth.api'

import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import {
    HomeIcon,
    RectangleGroupIcon,
    PresentationChartLineIcon,
    BellIcon,
} from '@heroicons/react/24/outline'
import CLoading from './CLoading'
import { v4 as uuidv4 } from 'uuid'
import { readNotifications } from 'apis/notification.api'
import moment from 'moment'

function CHeader() {
    //#region data
    const notificationSocket = useContext(SocketContext)
    const [noti, setNoti] = useState(null)
    const [me, setMe] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            delete user.accessToken
            delete user.refreshTokenToken
            return user
        } else return null
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { data, isLoading: isNotificationsLoading, set } = getAllNotifications()
    const notifications = useMemo(() => data?.data ?? [], [data])
    //#endregion

    //#region event
    // Wait socket
    useEffect(() => {
        notificationSocket.on('server-send-message-noti', (noti) => {
            if (parseInt(me.id) !== parseInt(noti.user_id)) {
                setNoti({ ...noti, is_read: false, created_at: new Date() })
            }
        })
        notificationSocket.on('server-send-question-noti', (noti) => {
            if (parseInt(me.id) !== parseInt(noti.user_id)) {
                if (
                    noti.content.includes('answer') &&
                    parseInt(me.id) !== parseInt(noti.userAnsweredId)
                ) {
                    return
                } else {
                    setNoti({ ...noti, is_read: false, created_at: new Date() })
                }
            }
        })
        notificationSocket.on('server-send-presentingPresentation-noti', (noti) => {
            if (parseInt(me.id) !== parseInt(noti.user_id)) {
                setNoti({ ...noti, is_read: false, created_at: new Date() })
            }
        })

        return () => {
            notificationSocket.off('server-send-message-noti')
            notificationSocket.off('server-send-question-noti')
            notificationSocket.off('server-send-presentingPresentation-noti')
        }
    }, [notificationSocket, me])

    useEffect(() => {
        if (data?.data && noti) {
            const newNotifications = [...data.data]

            newNotifications.unshift({ ...noti, id: uuidv4() })

            set({ ...data, data: newNotifications })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noti])

    const handleLogout = async () => {
        setIsLoading(true)
        const res = await logout()
        if (res.data) {
            setMe({})
            setIsLoading(false)
            navigate('/')
        }
    }
    const handleReadNoti = async () => {
        if (notifications.some((noti) => noti.is_read === false)) {
            const newNotifications = [...data.data]

            const mapNotifications = newNotifications.map((noti) => ({
                ...noti,
                is_read: true,
            }))

            set({ ...data, data: mapNotifications })

            // api
            await readNotifications()
        }
    }
    //#endregion

    return (
        <div className="z-20 shadow-lg">
            <Navbar fluid={true} rounded={true}>
                <Navbar.Brand>
                    <Link to="/">
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            GroupsApp
                        </span>
                    </Link>
                </Navbar.Brand>

                <div className="flex md:order-2">
                    {me?.name ? (
                        <div className="flex items-center ">
                            <Dropdown
                                arrowIcon={false}
                                inline={true}
                                className="h-[24rem] overflow-y-auto"
                                label={
                                    <div className="relative">
                                        <BellIcon
                                            className="mr-2 h-7 w-7"
                                            onClick={handleReadNoti}
                                        />
                                        {notifications?.some((e) => e.is_read === false) && (
                                            <span className="absolute top-0 right-2 flex h-3 w-3">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                                <span className="relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-sky-500 text-[8px]"></span>
                                            </span>
                                        )}
                                    </div>
                                }
                            >
                                {!isNotificationsLoading && notifications.length > 0 ? (
                                    notifications?.map((noti, index) => (
                                        <div key={noti.id}>
                                            <Dropdown.Item
                                                className={`mx-2 w-80 ${
                                                    index === 0 ? '' : 'border-t'
                                                }`}
                                                onClick={() => {
                                                    navigate(noti.link)
                                                }}
                                            >
                                                <div className="flex-1">
                                                    <p
                                                        className={`text-sm font-semibold text-gray-600`}
                                                    >
                                                        {noti.content}
                                                    </p>
                                                    <span
                                                        className={`block text-right text-xs text-gray-600`}
                                                    >
                                                        {moment(noti.created_at).utc().fromNow()}
                                                    </span>
                                                </div>
                                            </Dropdown.Item>
                                        </div>
                                    ))
                                ) : (
                                    <span className="p-3">You don't have any notification</span>
                                )}
                            </Dropdown>
                            <Dropdown
                                arrowIcon={false}
                                inline={true}
                                label={
                                    <Avatar
                                        alt="User settings"
                                        img={me?.image}
                                        rounded={true}
                                        referrerPolicy="no-referrer"
                                    />
                                }
                            >
                                <Dropdown.Header>
                                    <span className="block text-sm">{me?.name}</span>
                                    <span className="block truncate text-sm font-medium">
                                        {me?.email}
                                    </span>
                                </Dropdown.Header>
                                <Dropdown.Item
                                    onClick={() => {
                                        navigate('/profile')
                                    }}
                                >
                                    Profile
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <div className="mr-1">
                                <Link to="/auth/login">
                                    <Button size="sm" outline={true}>
                                        Login
                                    </Button>
                                </Link>
                            </div>
                            <div className="ml-1">
                                <Link to="/auth/register">
                                    <Button size="sm">Register</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                    <Navbar.Toggle />
                </div>

                <Navbar.Collapse>
                    <Navbar.Link>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center text-base ${
                                    isActive && 'border-blue-600 text-blue-700'
                                } `
                            }
                        >
                            <HomeIcon className="mr-2 h-5 w-5" /> Home
                        </NavLink>
                    </Navbar.Link>
                    <Navbar.Link>
                        <NavLink
                            to="/presentation"
                            className={({ isActive }) =>
                                `flex items-center text-base ${
                                    isActive && 'border-blue-600 text-blue-700'
                                } `
                            }
                        >
                            <PresentationChartLineIcon className="mr-2 h-5 w-5" /> My presentations
                        </NavLink>
                    </Navbar.Link>
                    <Navbar.Link>
                        <NavLink
                            to="group"
                            className={({ isActive }) =>
                                `flex items-center text-base ${
                                    isActive && 'border-blue-600 text-blue-700'
                                } `
                            }
                        >
                            <RectangleGroupIcon className="mr-2 h-5 w-5" /> My Groups
                        </NavLink>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
            {isLoading && <CLoading />}
        </div>
    )
}

export default CHeader
