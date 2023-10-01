import { lazy } from 'react'

const Profile = lazy(() => import('./MProfile'))
const EditProfile = lazy(() => import('./MEditProfile'))

export { Profile, EditProfile}
