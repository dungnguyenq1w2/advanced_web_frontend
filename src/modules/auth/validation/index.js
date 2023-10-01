import * as Yup from 'yup'

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Email is not valid').required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be more 6 characters'),
})

export const resetPasswordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be more 6 characters'),
    confirmPassword: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be more 6 characters'),
})

export const identifyValidationSchema = Yup.object().shape({
    email: Yup.string().email('Email is not valid').required('Email is required'),
})

export const registerValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email is not valid').required('Hãy nhập Email'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be more 6 characters'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Password is not match'),
})
