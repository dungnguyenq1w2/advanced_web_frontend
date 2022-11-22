import { joinGroupByLink } from 'apis/group.api'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const MGroupInvite = () => {
    const { groupId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isError404, setIsError404] = useState(false)
    const navigate = useNavigate()

    console.log('Cvhbajnsssssssssssssssssssssssslbcbsa vadbjb')
    useEffect(() => {
        const joinGroup = async () => {
            setIsLoading(true)
            const res = await joinGroupByLink(groupId)

            if (res?.error?.status === 404) {
                setIsFirst(false)
                setIsError404(true)
                //navigate('/')
            }

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
            joinGroup()
        } else {
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
