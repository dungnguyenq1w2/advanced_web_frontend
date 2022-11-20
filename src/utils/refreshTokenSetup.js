export const refreshTokenSetup = (response) => {
    // console.log(response)
    let refreshTiming = (response.tokenObj.expires_in || 3600 - 5 * 60) * 1000
    // let refreshTokenVal = ''
    const refreshToken = async () => {
        const newAuthResponse = await response.reloadAuthResponse()
        refreshTiming = (newAuthResponse.expires_in || 3600 - 5 * 60) * 1000
        console.log('newAuthResponse: ', newAuthResponse)
        // saveUserToken(newAuthResponse.access_token) //save new token
        console.log('New Auth Token: ', newAuthResponse.id_token)

        // refreshTokenVal = newAuthResponse.id_token

        // Set up the other timer after the first one
        setTimeout(refreshToken, refreshTiming)
    }

    // Set up first refresh timer
    setTimeout(refreshToken, refreshTiming)
    // return refreshTokenVal
}
