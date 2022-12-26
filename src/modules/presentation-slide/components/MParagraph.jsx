import React from 'react'

import CLoading from 'common/components/CLoading'

function MParagraph({ data, isLoading }) {
    //#region Data
    //#endregion

    if (isLoading) return <CLoading />
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="mb-10 text-2xl">{data.paragraph}</h1>
        </div>
    )
}

export default MParagraph
