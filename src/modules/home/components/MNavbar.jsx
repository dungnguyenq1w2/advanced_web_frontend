import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postCheckCodePresentation } from 'apis/presentation.api'
import axios from 'axios'
function MNavbar() {
    //#region data
    const [msgError, setMsgError] = useState(null)
    const navigate = useNavigate()
    //#endregion

    //#region event
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()

            if (/^[0-9]{8}$/.test(e.target.value)) {
                const res = await postCheckCodePresentation({ code: e.target.value })

                if (res?.data?.id) {
                    setMsgError(null)
                    navigate(`/presentation-slide/${res?.data?.id}/member`)
                } else setMsgError('Number code invalid')
            } else setMsgError('Number code include 8 number')
        }
    }
    //#endregion
    // ??: Dùng khi underfine, null
    // &&: Dùng khi true, false, null(Vẫn là false)
    return (
        <div className="flex flex-row">
            <div className="mx-48 flex w-96 flex-1 shrink flex-row justify-center">
                <div className="flex flex-col">
                    <b className={msgError ? '' : 'py-2'}>Number code:</b>
                    {msgError && <span className="text-red-600">{msgError}</span>}
                </div>
                <div className="ml-3 flex-none">
                    <input
                        type="number"
                        id="code"
                        name="code"
                        className={
                            'block w-[180px] rounded-lg border bg-gray-50 p-2 text-center text-lg font-light text-gray-900  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ' +
                            (msgError
                                ? 'border-red-600 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500')
                        }
                        placeholder="Input number code"
                        onKeyDown={handleKeyDown}
                        required
                    />
                </div>
            </div>
        </div>
    )
}

export default MNavbar
