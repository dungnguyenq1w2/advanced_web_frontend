export function isSuccess(response) {
    const status = response?.response ? response.response.status : response.status
    return status.toString()[0] === '2'
}
