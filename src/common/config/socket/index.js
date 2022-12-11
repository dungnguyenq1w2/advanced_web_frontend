// import { io } from 'socket.io-client'

// const URL = 'http://localhost:5000'
// const socket = io(URL, { autoConnect: true })

// export { socket }

import { Manager } from 'socket.io-client'

const manager = new Manager('http://localhost:5000', {
    autoConnect: false,
})

const socket = manager.socket('/') // main namespace
const hostSocket = manager.socket('/host') // host namespace
const guestSocket = manager.socket('/guest') // guest namespace
export { socket, hostSocket, guestSocket }

// export default null
