import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { Button } from 'flowbite-react'

function MCheckbox({ choices, handleChoiceSendSocket }) {
    //#region data
    const [isError, setIsError] = useState(true)
    const { register, handleSubmit } = useForm()
    //#endregion

    //#region event
    const onSubmit = async (data) => {
        const entries = Object.entries(data)
        const choices = entries.filter((e) => e[1] === true).map((e) => e[0])

        if (choices.length) {
            // socket
            handleChoiceSendSocket(choices)
            setIsError(false)
        } else {
            setIsError(true)
        }
    }
    //#endregion

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex max-w-[80rem] flex-col pt-10"
            style={{ minWidth: '300px' }}
        >
            <ul className="mb-2 max-h-[25rem] overflow-y-auto rounded-lg bg-blue-900 bg-opacity-20 shadow">
                {choices?.map((e) => (
                    <li
                        key={e.id}
                        className="flex w-full items-center rounded-lg px-8 py-2 hover:bg-blue-900"
                    >
                        <input
                            id={e.id}
                            type="checkbox"
                            {...register(`${e.id}`)}
                            className="h-7 w-7 rounded border-2 border-gray-300 bg-transparent text-blue-800 focus:ring-2 focus:ring-blue-500"
                        />
                        <label
                            htmlFor={e.id}
                            className="ml-5 w-full py-3 text-xl font-medium text-gray-50"
                        >
                            {e.content}
                        </label>
                    </li>
                ))}
            </ul>
            <Button type="submit" size="lg">
                Submit
            </Button>
            {isError && <span className="mt-2 text-red-500">Bạn phải chọn ít nhất 1 lựa chọn</span>}
        </form>
    )
}

export default MCheckbox
