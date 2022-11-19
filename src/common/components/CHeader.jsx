import { useEffect, useState } from 'react'

import { Link, NavLink } from 'react-router-dom'

import { logout } from 'apis/auth.api'

import CLoading from './CLoading'

import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { HomeIcon, RectangleGroupIcon } from '@heroicons/react/24/outline'

function CHeader() {
    //#region data
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    //#endregion
   
    //#region event
    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')))
    }, [])

    const handleLogout = async () => {
        setIsLoading(true)
        const res = await logout()
        if (res.data) {
            setUser({})
            setIsLoading(false)
        }
    }
    //#endregion

    return (
        <div className="z-20 shadow-lg">
            <Navbar fluid={true} rounded={true}>
                <Navbar.Brand>
                    <Link to="/">
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            Flowbite
                        </span>
                    </Link>
                </Navbar.Brand>

                <div className="flex md:order-2">
                    {user?.name ? (
                        <Dropdown
                            arrowIcon={false}
                            inline={true}
                            label={
                                <Avatar
                                    alt="User settings"
                                    img={user?.image}
                                    rounded={true}
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className="block text-sm">{user?.name}</span>
                                <span className="block truncate text-sm font-medium">
                                    {user?.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item>Dashboard</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Earnings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown>
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
                            to="group"
                            className={({ isActive }) =>
                                `flex items-center text-base ${
                                    isActive && 'border-blue-600 text-blue-700'
                                } `
                            }
                        >
                            <RectangleGroupIcon className="mr-2 h-5 w-5" /> Group
                        </NavLink>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
            {isLoading && <CLoading />}
        </div>
    )
}

export default CHeader
