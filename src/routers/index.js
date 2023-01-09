import { createBrowserRouter } from 'react-router-dom'

import CAuthLayout from 'common/components/layouts/CAuthLayout'
import CSlideLayout from 'common/components/layouts/CSlideLayout'

import { Home } from 'modules/home/pages'
import { Login, Register, Verify, Identify, ResetPassword } from 'modules/auth/pages'
import { Group, GroupCreate, GroupInvite, GroupList } from 'modules/group/pages'
import { MemberSlide, HostSlide } from 'modules/presentation-slide/pages'
import { MemberSlideSession, HostSlideSession } from 'modules/presentation-slide-session/pages'
import { EditProfile, Profile } from 'modules/user/pages'
import C404 from 'common/components/layouts/C404'
import { PresentationEdit, PresentationList, PresentationCreate } from 'modules/presentation/pages'
import CMainLayout from 'common/components/layouts/CMainLayout'

const router = createBrowserRouter([
    {
        path: '/',
        element: <CMainLayout />,
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
                        path: ':presentationId/:slideId/edit',
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
            { path: 'identify', element: <Identify /> },
            { path: 'resetPassword', element: <ResetPassword /> },
        ],
    },
    {
        path: '/presentation-slide',
        element: <CSlideLayout />,
        children: [
            {
                path: ':presentationId/host',
                element: <HostSlide />,
            },
            {
                path: ':presentationId/member',
                element: <MemberSlide />,
            },
        ],
    },
    {
        path: '/presentation-slide-session',
        element: <CSlideLayout />,
        children: [
            {
                path: ':presentationId/host',
                element: <HostSlideSession />,
            },
            {
                path: ':presentationId/member',
                element: <MemberSlideSession />,
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
