import { SocketIONetwork } from '@niloc/socketio-client'
import './App.css'
import { io } from 'socket.io-client'
import { nanoid } from 'nanoid'
import { Router } from '@niloc/core'
import { Canvas } from './components/Canvas'
import { State } from './state/State'
import { Presence } from './core/Presence'

const params = new URLSearchParams(window.location.search)
const roomId = params.get("roomId")
if (!roomId) {
  window.location.href = "/?roomId=" + nanoid(7)
  throw "Redirecting..."
}

const peerId = nanoid(7)

const socket = io("http://localhost:3000", {
  query: {
    roomId,
    peerId
  }
})

const network = new SocketIONetwork(socket as any)

const router = new Router({ id: peerId, network })

State.initialize(new Presence(router))

function App() {
  return <div class="App">
    <Canvas />
  </div>
}

export default App
