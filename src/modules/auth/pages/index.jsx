import { lazy } from 'react'

const Login = lazy(() => import('./MLogin'))
const Register = lazy(() => import('./MRegister'))
const Verify = lazy(() => import('./MVerify'))

export { Login, Register, Verify }
