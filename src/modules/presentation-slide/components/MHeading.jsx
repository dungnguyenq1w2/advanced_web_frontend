import React from 'react'

import CLoading from 'common/components/CLoading'

function MHeading({ data, isLoading }) {
    //#region Data
    //#endregion

    if (isLoading) return <CLoading />
    return (
        <div className="flex h-full animate-[show-slow_0.5s_ease-in] flex-col items-center justify-center pb-10">
            <h1 className="mb-16 w-[70rem] pl-80 text-center text-8xl">{data.heading}</h1>
            <h2 className="w-[70rem] pl-80 text-center text-4xl">{data.subheading}</h2>
        </div>
    )
}

export default MHeading
