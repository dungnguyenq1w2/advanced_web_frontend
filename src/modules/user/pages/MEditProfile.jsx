import { yupResolver } from '@hookform/resolvers/yup'
import { updateProfile } from 'apis/user.api'
import { getById } from 'common/queries-fn/users.query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const schema = yup
    .object({
        phone: yup
            .string()
            .matches(/0[0-9]{9}/, 'Phone number is not valid')
            .required('Input phone'),
        name: yup.string().min(5).required('Input name'),
    })
    .required()

function MEditProfile() {
    const { data, isLoading } = getById(JSON.parse(localStorage.getItem('user')).id)
    if (!data) {
        alert('Login to use this feature')
        navigate('/auth/login')
    }
    const [user, setUser] = useState(data?.data?.data)
    useEffect(() => {
        setUser(data?.data?.data)
    }, [data])
    const [image, setImage] = useState()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        const updateUser = async (userData) => {
            const res = await updateProfile(user.id, JSON.stringify(userData))
            if (res.data) {
                const localUser = JSON.parse(localStorage.getItem('user'))
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        ...localUser,
                        ...res.data.data,
                    })
                )
                window.setTimeout(function () {
                    window.location = '/profile'
                }, 0)
                window.onbeforeunload = null
            }
        }
        try {
            if (image) {
                const reader = new FileReader()
                await reader.readAsDataURL(image)
                reader.onloadend = async () => {
                    data.image = reader.result
                    updateUser(data)
                }
            } else {
                updateUser(data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const onImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
            setUser({ ...user, image: URL.createObjectURL(e.target.files[0]) })
        }
    }
    return (
        <div className="flex h-[70vh] w-full items-center justify-center rounded-[12px]">
            <div className="h-2/4 w-[650px] items-center justify-center rounded-lg bg-white shadow-xl">
                <b className="block py-3 text-center text-[30px] font-light">Edit profile</b>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex rounded bg-white px-8 pt-3 pb-8 shadow-md"
                >
                    <div className="photo-wrapper pr-3 pt-4">
                        <img
                            className="mx-auto h-40 w-40 rounded-full"
                            src={user?.image}
                            alt={user?.name}
                        />
                        <input
                            class="mt-4 ml-10 block h-[40px] w-3/4 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            id="file"
                            name="file"
                            onChange={(e) => onImageChange(e)}
                            type="file"
                        ></input>
                    </div>
                    <div className="ml-2 flex-1">
                        <div className="mb-4">
                            <label
                                className="mb-2 block text-sm font-bold text-gray-700"
                                for="email"
                            >
                                Email
                            </label>
                            <input
                                className="shadow-outline w-full appearance-none rounded border py-2 px-3 text-gray-700 shadow outline-none"
                                id="email"
                                type="text"
                                readOnly
                                value={user?.email}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="mb-2 block text-sm font-bold text-gray-700"
                                for="name"
                            >
                                Name
                            </label>
                            <input
                                className=" borderpy-2 mb-3 w-full appearance-none rounded px-3 text-gray-700 shadow"
                                id="name"
                                type="text"
                                autoFocus
                                value={user?.name}
                                {...register('name')}
                                onChange={(e) => {
                                    setUser({ ...user, name: e.target.value })
                                }}
                                required
                            />
                            <p style={{ color: 'red' }}>{errors.name?.message}</p>
                        </div>
                        <div className="mb-4">
                            <label
                                className="mb-2 block text-sm font-bold text-gray-700"
                                for="phone"
                            >
                                Phone
                            </label>
                            <input
                                className=" borderpy-2 mb-3 w-full appearance-none rounded px-3 text-gray-700 shadow"
                                id="phone"
                                type="number"
                                value={user?.phone}
                                pattern="0[0-9]{9}"
                                placeholder="Phone number consists of 10 digits, starting with 0"
                                {...register('phone')}
                                onChange={(e) => {
                                    setUser({ ...user, phone: e.target.value })
                                }}
                                required
                            />
                            <p style={{ color: 'red' }}>{errors.phone?.message}</p>
                        </div>
                        <div className="my-3 text-center">
                            <button
                                type="submit"
                                className="inline-flex cursor-pointer items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Save
                            </button>
                            <a
                                onClick={() => {
                                    navigate('/profile')
                                }}
                                className="ml-3 inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                            >
                                Cancel
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MEditProfile

{
    /* <div className="flex h-2/4 w-[550px] items-center justify-center rounded-lg bg-white shadow-xl">
                <div className="photo-wrapper pr-14.5">
                    <img
                        className="mx-auto h-40 w-40 rounded-full"
                        src={user?.image}
                        alt={user?.name}
                    />
                </div>
                <div className="p-3">
                    <h3 className="flex-1 text-center text-xl font-medium leading-8 text-gray-900">
                        {user?.name}
                    </h3>
                    <table className="my-3 text-base">
                        <tbody>
                            <tr>
                                <td className="px-2 py-2 text-gray-500">
                                    <b>Email:</b>
                                </td>
                                <input
                                    className="w-full rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700"
                                    id="email"
                                    name="email"
                                    type="text"
                                    readOnly
                                    required
                                    value={user?.email}
                                ></input>
                                {/* <td className="px-2 py-2">{user?.email}</td> */
}
//                 </tr>
//                 <tr>
//                     <td className="px-2 py-2 text-gray-500">
//                         <b>Phone:</b>
//                     </td>
//                     <input
//                         className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
//                         id="inline-full-name"
//                         type="text"
//                         autoFocus
//                         value={user?.phone ?? ''}
//                     ></input>
//                     {/* <td className="px-2 py-2">{user?.phone ?? 'None'}</td> */}
//                 </tr>
//             </tbody>
//         </table>

//         <div className="my-3 text-center">
//             <a
//                 onClick={handleSave}
//                 className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//             >
//                 Save
//             </a>
//             <a
//                 onClick={() => {
//                     navigate('/profile')
//                 }}
//                 className="ml-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
//             >
//                 Cancel
//             </a>
//         </div>
//     </div>
// </div> */}
