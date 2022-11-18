import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { USERS } from './_constant'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).get(USERS.GET, params)
}
