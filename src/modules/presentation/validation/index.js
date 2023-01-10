import * as Yup from 'yup'

export const presentationValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
})

export const checkValidSlideInputs = (currentSlide, slideChoices) => {
    if (!currentSlide || !currentSlide.type) return false

    if (currentSlide.type === 1) {
        if (!currentSlide.heading || !currentSlide.subheading) {
            return false
        }
    } else if (currentSlide.type === 2) {
        if (!currentSlide.paragraph) {
            return false
        }
    } else if (currentSlide.type === 3) {
        if (!currentSlide.question) {
            return false
        }
        // console.log('🚀 ~ currentSlide', currentSlide)

        // console.log('🚀 ~ slideChoices', slideChoices)
        for (const choice of slideChoices) {
            if (choice.action) {
                if (choice.action === 'ADD' || choice.action === 'UPDATE') {
                    if (!choice.content) {
                        return false
                    }
                }
            }
        }
    } else {
    }

    return true
}
