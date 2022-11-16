import { lazy } from 'react'

const Login = lazy(() => import('./MLogin'))
const Register = lazy(() => import('./MRegister'))

export { Login, Register }
