import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { QUESTIONS } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: [] }
    }).get(QUESTIONS.GET_ALL, params)
}
