import * as Yup from 'yup'

export const checkboxValidationSchema = Yup.object().shape({
    choice: Yup.boolean().oneOf([true]),
})

export const messageValidationSchema = Yup.object().shape({
    message: Yup.string().required(),
})
