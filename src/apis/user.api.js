import { map } from '#root/utils/axios'
import { isSuccess } from '#root/utils/func'
import { USERS } from './_contanst'

export const getAll = (params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data } : { data: [] }
    }).get(USERS.GET, params)
}
