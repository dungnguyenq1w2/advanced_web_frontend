import * as Yup from 'yup'

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Hãy nhập Email'),
    password: Yup.string().required('Hãy nhập Mật khẩu').min(6, 'Mật khẩu phải hơn 6 kí tự'),
})

export const registerValidationSchema = Yup.object().shape({
    name: Yup.string().required('Hãy nhập Họ tên'),
    email: Yup.string().email('Email không hợp lệ').required('Hãy nhập Email'),
    password: Yup.string().required('Hãy nhập Mật khẩu').min(6, 'Mật khẩu phải hơn 6 kí tự'),
    confirmPassword: Yup.string()
        .required('Hãy nhập Mật khẩu xác nhận')
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
})
