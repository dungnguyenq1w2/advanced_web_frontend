import { Suspense } from 'react'

import { Outlet } from 'react-router-dom'

import CLoading from '../CLoading'

function CSlideLayout() {
    return (
        <>
            <div className="h-[100vh] bg-black">
                <Suspense fallback={<CLoading />}>
                    <Outlet />
                </Suspense>
            </div>
        </>
    )
}

export default CSlideLayout
