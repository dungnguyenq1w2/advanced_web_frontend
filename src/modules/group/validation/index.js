import * as Yup from 'yup'

export const groupValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
})

export const emailVailation = Yup.object().shape({
    email: Yup.string().email('Email is not valid'),
})
