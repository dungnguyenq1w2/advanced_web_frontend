import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import reportWebVitals from './reportWebVitals'

import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import router from './routers'
import client from 'utils/react-query'
// import { GoogleOAuthProvider } from '@react-oauth/google'

const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(
//     <React.StrictMode>
//         {/* <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}> */}
//         <QueryClientProvider client={client}>
//             <RouterProvider router={router} />
//         </QueryClientProvider>
//         {/* </GoogleOAuthProvider> */}
//     </React.StrictMode>
// )

root.render(
    <QueryClientProvider client={client}>
        <RouterProvider router={router} />
    </QueryClientProvider>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
