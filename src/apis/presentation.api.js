import { map } from 'utils/axios'
import { isSuccess } from 'utils/func'
import { PRESENTATIONS } from './_constant'

export const getAllByHostId = (hostId, params = {}) => {
    return map(({ data, ...rest }) => {
        return isSuccess(rest) ? { data: data.data } : { data: [] }
    }).get(PRESENTATIONS.GET_ALL_BY_HOST_ID(hostId), params)
}
