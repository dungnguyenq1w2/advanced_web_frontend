import { useState, useEffect } from 'react'
import { ArrowPathIcon} from '@heroicons/react/24/outline'
function MNavbar() {
    //#region data

    //#endregion

    //#region event
    const addSilde = () => {

    }
    //#endregion

    return (
        <div className="flex flex-row">
            <button
                className="mx-32 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                onClick={addSilde}
            >
                + Add Slide
            </button>
            <div className="mx-48 flex w-96 flex-1 shrink flex-row">
                <b className="py-2">Number code: </b>
                <div className="ml-3 flex-none">
                    <input
                        type="text"
                        id="code"
                        className="block w-40 rounded-lg border border-gray-300 bg-gray-50 p-2 text-lg font-extrabold text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-center"
                        value="09211234"
                        required
                        readOnly
                    ></input>
                </div>
                <ArrowPathIcon className="mx-2 my-1 h-8 w-8 cursor-pointer text-blue-600" />
            </div>
            <button className="mx-28 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
                Present
            </button>
        </div>
    )
}

export default MNavbar
