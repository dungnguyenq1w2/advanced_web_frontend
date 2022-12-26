import React from 'react'

import CLoading from 'common/components/CLoading'

function MHeading({ data, isLoading }) {
    //#region Data
    //#endregion

    if (isLoading) return <CLoading />
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="mb-10 text-8xl">{data.heading}</h1>
            <h2 className="text-4xl">{data.subheading}</h2>
        </div>
    )
}

export default MHeading
