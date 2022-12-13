import * as Yup from 'yup'

export const presentationValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
})
