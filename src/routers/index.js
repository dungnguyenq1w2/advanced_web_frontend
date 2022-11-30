import { createBrowserRouter } from 'react-router-dom'

import App from 'App'

import { Home } from 'modules/home/pages'
import { Login, Register, Verify } from 'modules/auth/pages'
import { Group, GroupCreate, GroupInvite, GroupList } from 'modules/group/pages'
import CAuthLayout from 'common/components/layouts/CAuthLayout'
import { EditProfile, Profile } from 'modules/user/pages'
import C404 from 'common/components/layouts/C404'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'group',
                children: [
                    {
                        index: true,
                        element: <GroupList />,
                    },
                    {
                        path: ':groupId',
                        children: [
                            {
                                index: true,
                                element: <Group />,
                            },
                            {
                                path: 'invite',
                                element: <GroupInvite />,
                            },
                        ],
                    },
                    {
                        path: 'create',
                        element: <GroupCreate />,
                    },
                ],
            },
            {
                path: 'profile',
                children: [
                    {
                        index: true,
                        element: <Profile />,
                    },
                    {
                        path: 'edit',
                        element: <EditProfile />,
                    },
                ],
            },
        ],
    },
    {
        path: '/auth',
        element: <CAuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'verify', element: <Verify /> },
        ],
    },
    {
        path: '*',
        element: <C404 />,
    },
    {
        path: '/404',
        element: <C404 />,
    },
])

export default router
