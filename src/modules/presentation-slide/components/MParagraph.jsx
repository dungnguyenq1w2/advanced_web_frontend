import React from 'react'

import CLoading from 'common/components/CLoading'

function MParagraph({ data, isLoading }) {
    //#region Data
    //#endregion

    if (isLoading) return <CLoading />
    return (
        <div className="flex h-full animate-[show-slow_0.5s_ease-in] flex-col items-center justify-center pb-10 pl-40 ">
            <h1 className="mb-10 px-40 text-center text-2xl">{data.paragraph}</h1>
        </div>
    )
}

export default MParagraph
