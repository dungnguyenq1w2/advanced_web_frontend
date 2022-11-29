import React from 'react'

import { Spinner } from 'flowbite-react'

function CLoading() {
    return (
        <div className="fixed top-[4.5rem] left-1/2 z-10 -translate-x-1/2 animate-[slip-down_0.5s_ease-in-out]">
            <Spinner aria-label="Extra large spinner example" size="xl" />
        </div>
    )
}

export default CLoading
