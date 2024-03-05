import "./App.scss"
import { SocketIONetwork } from '@niloc/socketio-client'
import { Framework, Identity } from '@niloc/core'
import { io } from 'socket.io-client'
import { FrameworkView } from './FrameworkView'
import { User } from './User'

function mockFramework(userId: string, host: boolean) {
  const socket = io("http://localhost:3456", {
    query: {
      peerId: userId,
      host
    }
  })

  const network = new SocketIONetwork(socket)

  const framework = new Framework({
    network,
    identity: new Identity(userId, host),
    userType: User,
  })

  console.log('framework', userId, framework)

  return framework
}

const frameworks = [
  mockFramework("1", true),
  mockFramework("2", false),
]

function App() {
  return <div className="App">
    {frameworks.map(framework => {
      return <FrameworkView
        framework={framework}
        key={framework.router.identity.userId}
      />
    })}
  </div>
}

export default App
