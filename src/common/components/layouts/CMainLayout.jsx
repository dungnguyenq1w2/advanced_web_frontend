import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import CFooter from 'common/components/CFooter'
import CHeader from 'common/components/CHeader'
import CLoading from 'common/components/CLoading'

function CMainLayout() {
    return (
        <>
            <CHeader />

            <div className="min-h-[85vh] bg-slate-100">
                <Suspense fallback={<CLoading />}>
                    <Outlet />
                </Suspense>
            </div>

            <CFooter />
        </>
    )
}

export default CMainLayout
