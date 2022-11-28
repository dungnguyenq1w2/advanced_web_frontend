import { useEffect, useState } from 'react'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { joinGroupByEmail, joinGroupByLink } from 'apis/group.api'
import CLoading from 'common/components/CLoading'

const MGroupInvite = () => {
    const { groupId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleJoinGroup = async () => {
            setIsLoading(true)
            const res = await joinGroupByLink(groupId)

            if (res?.data) {
                setIsLoading(false)
                navigate(`/group/${groupId}`)
            } else {
                setIsLoading(false)
                setErrorMessage(res.error?.message)
            }
        }
        const handleJoinGroupByEmail = async () => {
            setIsLoading(true)
            const res = await joinGroupByEmail(groupId, {
                email: searchParams.get('email'),
                token: searchParams.get('token'),
            })
            if (res?.data) {
                setIsLoading(false)
                navigate(`/group/${groupId}`)
            } else {
                setIsLoading(false)
                setErrorMessage(res.error?.message)
            }
        }

        const user = localStorage.getItem('user')

        if (user) {
            if (searchParams.get('email')) {
                handleJoinGroupByEmail()
            } else {
                handleJoinGroup()
            }
        } else {
            alert('Login to use this feature')
            navigate('/auth/login')
        }
    }, [groupId, navigate, searchParams])

    return (
        <div className="flex flex-col items-center p-8">
            {isLoading ? (
                <CLoading />
            ) : errorMessage ? (
                <h2 className="text-red-800">{errorMessage}</h2>
            ) : null}
        </div>
    )
}

export default MGroupInvite
