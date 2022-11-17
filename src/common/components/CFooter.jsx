import React from 'react'
import { Footer } from 'flowbite-react'
function CFooter() {
    return (
        <Footer container={true}>
            <div className="w-full">
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Flowbite™" year={2022} />
                </div>
            </div>
        </Footer>
    )
}

export default CFooter
