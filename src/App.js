import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import CFooter from 'common/components/CFooter'
import CHeader from 'common/components/CHeader'
import CLoading from 'common/components/CLoading'

function App() {
    // const { data: _data, isLoading: isDataLoading } = getAll()
    // console.log('🚀 ~ _data', _data)

    return (
        <>
            <CHeader />

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
