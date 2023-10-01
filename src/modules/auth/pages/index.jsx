import { lazy } from 'react'

const Login = lazy(() => import('./MLogin'))
const Register = lazy(() => import('./MRegister'))
const Verify = lazy(() => import('./MVerify'))
const Identify = lazy(() => import('./MIdentify'))
const ResetPassword = lazy(() => import('./MResetPassword'))

export { Login, Register, Verify, Identify, ResetPassword }
