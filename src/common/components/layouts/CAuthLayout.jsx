import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import CLoading from '../CLoading'

function CAuthLayout() {
    return (
        <>
            <div className="min-h-[100vh] bg-slate-100">
                <Suspense fallback={<CLoading />}>
                    <Outlet />
                </Suspense>
            </div>
        </>
    )
}

export default CAuthLayout
