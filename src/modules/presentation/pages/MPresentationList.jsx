import { useMemo } from 'react'
import CLoading from 'common/components/CLoading'
import { deletePresentation } from 'apis/presentation.api'
import { getAllByHostId } from 'common/queries-fn/presentations.query'
import { FireIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown } from 'flowbite-react'
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/20/solid'

function MPresentationList() {
    //#region data
    const navigate = useNavigate()
    const localUser = JSON.parse(localStorage.getItem('user'))
    const { data, isLoading, refetch } = getAllByHostId(localUser.id)
    const presentations = useMemo(() => data?.data ?? [], [data])
    //#endregion

    //#endregion event
    if (!localUser) {
        alert('Login to use this feature')
        navigate('/auth/login')
    }

    const handleDelPresentation = async (presentationId) => {
        const res = await deletePresentation(presentationId)

        if (res?.status) refetch()
    }

    const handleDropdownClick = (e) => {
        e.stopPropagation()
    }

    const handlePresentationClick = (presentationId) => {
        navigate(`/presentation-slide/${presentationId}/host`)
    }
    //#endregion

    if (isLoading) {
        return <CLoading />
    }

    return (
        <div className="mx-2 cursor-pointer pt-10 md:mx-10 lg:mx-20 xl:mx-40 2xl:mx-60">
            <div className="bg-white p-5">
                <div className="container grid grid-cols-1 gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {presentations.map((presentation, index) => {
                        return (
                            <div
                                key={index}
                                className="overflow-hidden rounded border border-gray-300 bg-white"
                                title="present"
                                onClick={() => handlePresentationClick(presentation?.id)}
                            >
                                <div className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <div className="mb-2 flex-1 text-xl font-bold">
                                            <h2>{presentation?.name}</h2>
                                        </div>

                                        <div onClick={handleDropdownClick}>
                                            <Dropdown
                                                arrowIcon={false}
                                                inline={true}
                                                placement="right"
                                                label={<EllipsisVerticalIcon className="h-7 w-7" />}
                                            >
                                                <Link to={`edit/${presentation?.id}`}>
                                                    <Dropdown.Item className="text-[#1A94FF]">
                                                        <PencilSquareIcon className="h-5 w-6 cursor-pointer pr-1 text-[#1A94FF]" />
                                                        <h3>Edit</h3>
                                                    </Dropdown.Item>
                                                </Link>

                                                <Dropdown.Item
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        handleDelPresentation(presentation?.id)
                                                    }
                                                >
                                                    <XMarkIcon className="h-6 w-6 cursor-pointer pr-1 text-red-600" />
                                                    <h3>Delete</h3>
                                                </Dropdown.Item>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    {/* <button to={``}> */}
                                    <div className="text-md mb-2 flex items-center">
                                        <div>
                                            <FireIcon className="mr-2 h-5 w-5" />
                                        </div>
                                        <span className="text-left">
                                            You are owner of this presentation
                                        </span>
                                    </div>
                                    {/* </button> */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MPresentationList
