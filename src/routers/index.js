import { createBrowserRouter } from 'react-router-dom'

import App from 'App'

import { Home } from 'modules/home/pages'
import { Login, Register, Verify } from 'modules/auth/pages'
import { Group, GroupCreate, GroupList } from 'modules/group/pages'

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
                        element: <Group />,
                    },
                    {
                        path: 'create',
                        element: <GroupCreate />,
                    },
                ],
            },
            {
                path: 'auth',
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> },
                    { path: 'verify', element: <Verify /> },
                ],
            },
        ],
    },
])

export default router
