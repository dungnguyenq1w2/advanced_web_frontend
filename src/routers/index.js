import { createBrowserRouter } from 'react-router-dom'

import App from 'App'
import CAuthLayout from 'common/components/layouts/CAuthLayout'
import CSlideLayout from 'common/components/layouts/CSlideLayout'

import { Home } from 'modules/home/pages'
import { Login, Register, Verify } from 'modules/auth/pages'
import { Group, GroupCreate, GroupInvite, GroupList } from 'modules/group/pages'
import { GuestSlide, HostSlide } from 'modules/slide/pages'
import { EditProfile, Profile } from 'modules/user/pages'
import C404 from 'common/components/layouts/C404'
import { PresentationEdit, PresentationList, PresentationCreate } from 'modules/presentation/pages'

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
            {
                path: 'presentation',
                children: [
                    {
                        index: true,
                        element: <PresentationList />,
                    },
                    {
                        path: 'create',
                        element: <PresentationCreate />,
                    },
                    {
                        path: 'edit',
                        element: <PresentationEdit />,
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
        path: '/slide',
        element: <CSlideLayout />,
        children: [
            {
                path: ':slideId/host',
                element: <HostSlide />,
            },
            {
                path: ':slideId/guest',
                element: <GuestSlide />,
            },
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
