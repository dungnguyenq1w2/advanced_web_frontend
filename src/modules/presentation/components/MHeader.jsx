import { useState, useEffect } from 'react'
import { PlayIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { add as addSlide } from 'apis/slide.api'
import { useNavigate } from 'react-router-dom'

function MHeader({ presentationId, refetchSlides }) {
    //#region data
    const navigate = useNavigate()
    //#endregion

    //#region event
    const handleAddSlide = async () => {
        try {
            const res = await addSlide({
                question: '',
                presentation_id: presentationId,
            })

            if (res?.data) {
                await refetchSlides()
                navigate(`/presentation/${presentationId}/${res?.data?.id}/edit`)
            }
        } catch (error) {
            console.log('Error', error)
        }
    }
    //#endregion

    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-row">
                <div className="mx-7 flex-none">
                    <input
                        type="text"
                        id="code"
                        className="block w-40 rounded-lg border border-gray-300 bg-gray-50 p-2 text-center text-lg font-normal text-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Name presentation"
                        required
                        autoFocus
                    ></input>
                </div>
                <button
                    className="mr-32 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                    onClick={handleAddSlide}
                >
                    + Add Slide
                </button>
            </div>
            {/* (Đừng xóa)(Đừng xóa)(Đừng xóa)(Đừng xóa) */}
            {/* Để mang qua EditPresentation(Đừng xóa), tạo Presentation thì bên front-end không cần, back-end sẽ tạo number code: 8 số và lưu vào database */}
            {/* <div className="mx-48 flex w-96 flex-1 shrink flex-row">
                <b className="py-2">Number code: </b>
                <div className="ml-3 flex-none">
                    <input
                        type="text"
                        id="code"
                        className="block w-40 rounded-lg border border-gray-300 bg-gray-50 p-2 text-center text-lg font-extrabold text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        value="09211234"
                        required
                        readOnly
                    ></input>
                </div>
                <ArrowPathIcon className="mx-2 my-1 h-8 w-8 cursor-pointer text-blue-600" />
            </div> */}
            <button className="mx-28 flex w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
                <PlayIcon className="h-6 w-6 cursor-pointer pr-1.5 text-cyan-400" />
                <h3> Present</h3>
            </button>
        </div>
    )
}

export default MHeader
