import { useEffect, useState } from 'react'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { joinGroupByLink } from 'apis/group.api'

const MGroupInvite = () => {
    const { groupId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isError404, setIsError404] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const joinGroup = async () => {
            setIsLoading(true)
            const res = await joinGroupByLink(groupId)

            // if (res?.error?.status === 404) {
            //     setIsFirst(false)
            //     setIsError404(true)
            //     //navigate('/')
            // }

            if (res?.data) {
                setIsFirst(false)
                setIsLoading(false)
                navigate(`/group/${groupId}`)
            } else {
                setIsLoading(false)
                setErrorMessage(res.error?.message)
            }
        }
        const joinGroupByEmail = async () => {
            setIsLoading(true)
            const res = await joinGroupByEmail(groupId, {
                email: searchParams?.email,
                token: searchParams?.token,
            })

            // if (res?.error?.status === 404) {
            //     setIsFirst(false)
            //     setIsError404(true)
            //     //navigate('/')
            // }

            if (res?.data) {
                setIsFirst(false)
                setIsLoading(false)
                navigate(`/group/${groupId}`)
            } else {
                setIsLoading(false)
                setErrorMessage(res.error?.message)
            }
        }
        const user = localStorage.getItem('user')

        if (user) {
            if (searchParams?.email) {
                joinGroupByEmail()
            } else {
                joinGroup()
            }
        } else {
            alert('Login to use this feature')
            navigate('/auth/login')
        }
    }, [])

    return (
        <div>
            <p></p>
        </div>
    )
}

export default MGroupInvite
