// import { io } from 'socket.io-client'
import { Manager } from 'socket.io-client'

const URL = process.env.REACT_APP_BACKEND_URL

// const socket = io(URL, { autoConnect: true })

// export { socket }

const manager = new Manager(URL, {
    autoConnect: false,
})

const socket = manager.socket('/') // main namespace
const hostSocket = manager.socket('/host') // host namespace
const guestSocket = manager.socket('/guest') // guest namespace
export { socket, hostSocket, guestSocket }

// export default null
