import { createBrowserRouter } from 'react-router-dom'

import App from 'App'

import { Home } from 'modules/home/pages'
import { Login, Register } from 'modules/auth/pages'
import { Group, GroupList } from 'modules/group/pages'

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
                ],
            },
            {
                path: 'auth',
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> },
                ],
            },
        ],
    },
])

export default router
