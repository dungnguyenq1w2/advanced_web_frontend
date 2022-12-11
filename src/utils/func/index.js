import axios from 'axios'

export function isSuccess(response) {
    const status = response?.response ? response.response.status : response.status
    if (status.toString() === '404') {
        return (window.location.href = '/404')
    }
    return status.toString()[0] === '2'
}

export const getIP = async () => {
    const res = await axios.get('https://www.cloudflare.com/cdn-cgi/trace')
    const data = res.data
        .trim()
        .split('\n')
        .reduce(function (obj, pair) {
            pair = pair.split('=')
            return (obj[pair[0]] = pair[1]), obj
        }, {})
    localStorage.setItem('ip', data.ip)
    return data.ip
}
