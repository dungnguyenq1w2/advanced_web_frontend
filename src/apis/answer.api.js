import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { ASNWERS } from './_constant'

export const add = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data?.data } : { data: {} }
    }).post(ASNWERS.ADD, params)
}
