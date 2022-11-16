import * as Yup from 'yup'

export const groupValidationSchema = Yup.object().shape({
    title: Yup.string().required('Hãy nhập Title'),
    description: Yup.string(),
})
