import * as Yup from 'yup'

export const groupValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
})

export const emailVailation = Yup.object().shape({
    email: Yup.string().email('Email is not valid'),
})
