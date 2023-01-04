import { useEffect } from 'react'

import { notificationSocket, SocketContext } from 'common/socket'

function App({ children }) {
    const me = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (me) {
            notificationSocket.open()
            notificationSocket.emit('subscribe', me.id)
            // window.addEventListener('beforeunload', (ev) => {
            //     ev.preventDefault()
            //     notificationSocket.emit('unsubscribe', me.id)
            // })
        }
    }, [me])

    return (
        <>
            <SocketContext.Provider value={notificationSocket}>{children}</SocketContext.Provider>
        </>
    )
}

export default App
