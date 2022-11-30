export function isSuccess(response) {
    const status = response?.response ? response.response.status : response.status
    if (status.toString() === '404') {
        return (window.location.href = '/404')
    }
    return status.toString()[0] === '2'
}
