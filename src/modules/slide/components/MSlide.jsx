import React from 'react'
import { Link } from 'react-router-dom'

function MSlide({ children, question }) {
    return (
        <div
            className="relative mx-20 h-full bg-contain bg-center bg-no-repeat text-white"
            style={{
                backgroundImage:
                    'url(https://images.mentimeter.com/images/dfa03a55-5287-45a3-977e-f688148bd0aa.png?auto=compress%2Cformat&fm=png&w=2000)',
            }}
        >
            <div className="absolute top-0 left-0 z-10 flex w-full flex-col items-center">
                <div className="w-full bg-gray-900 bg-opacity-20">
                    <h1 className="peer p-2 text-center text-2xl font-semibold">
                        Go to www.menti.com and use the code{' '}
                        <span className="text-3xl">2952 6208</span>
                    </h1>
                    <div className="hidden p-2 pb-4 text-center hover:block peer-hover:block">
                        <span className="mr-2 border border-gray-700 p-1 text-center text-sm font-normal">
                            www.menti.com/altkhq6u1k4w
                        </span>
                        <button className="border border-gray-500 p-1 text-sm font-medium hover:border-black hover:bg-black">
                            Copy link
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative h-full">
                <h1 className="absolute top-20 px-6 text-center text-[3.5rem] font-medium">
                    {question}?
                </h1>
                <div className="h-full">
                    {children}
                    <Link to="/slide/1/host">Prev </Link>
                    <Link to="/slide/2/host"> Next</Link>
                </div>
                <div className="absolute bottom-10 right-10">Num of member</div>
            </div>
        </div>
    )
}

export default MSlide
