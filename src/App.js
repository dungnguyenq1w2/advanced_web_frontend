import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import CFooter from 'common/components/CFooter'
import CHeader from 'common/components/CHeader'
import CLoading from 'common/components/CLoading'

function App() {
    // const { data: _data, isLoading: isDataLoading } = getAll()
    // console.log('🚀 ~ _data', _data)

    // const handleCallbackResponse = (response) => {
    //     console.log(response)
    //     console.log('Encoded JWT ID Token:' + response.credential)
    //     const userObject = jwtDecode(response.credential)
    //     console.log(userObject)
    // }

    // useEffect(() => {
    // const google = window.google
    // /* global google */
    // google.accounts.id.initialize({
    //     client_id: '433396208748-b93bnrb74g5tgenlrpmhii397a5hp8b7.apps.googleusercontent.com',
    //     callback: handleCallbackResponse,
    // })
    // google.accounts.id.renderButton(document.getElementById('signin-div'), {
    //     theme: 'outline',
    //     size: 'large',
    // })
    // google.accounts.id.prompt()
    // }, [])

    return (
        <>
            <CHeader />
            {/* <div id="signin-div"></div> */}
            <div className="min-h-[86.9vh] bg-slate-100">
                <Suspense fallback={<CLoading />}>
                    <Outlet />
                </Suspense>
            </div>

            <CFooter />
        </>
    )
}

export default App
