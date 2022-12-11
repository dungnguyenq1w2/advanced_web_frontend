import React from 'react'

import { Spinner } from 'flowbite-react'

function CLoading({ isInModal }) {
    return (
        <div
            className={`absolute ${
                isInModal ? 'top-[16.5rem]' : 'top-[4.5rem] animate-[slip-down_0.5s_ease-in-out]'
            } left-1/2 z-50 -translate-x-1/2 `}
        >
            <Spinner aria-label="Extra large spinner example" size="xl" />
        </div>
    )
}

export default CLoading
