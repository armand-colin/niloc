import { useState } from 'react'
import './App.css'
import { Framework, FrameworkChannels, Identity, SendLoopPlugin, User } from '@niloc/core'
import { AppContext } from './contexts/AppContext'
import { createNetwork } from "@niloc/room-client"
import { Env } from './Env'
import { Home } from './Home'
import { PostIt } from './types/PostIt'

function initApp(framework: Framework) {

  framework.model.addType(PostIt, "postit")

  framework.model.addPlugin(new SendLoopPlugin({ frequency: 500 }))

}

function App() {

  const [framework, setFramework] = useState<Framework | null>(null)

  function onValidate(data: FormData) {
    const identity = new Identity(data.userId, data.isHost)

    const network = createNetwork({
      identity,
      roomId: data.roomId,
      url: Env.ROOM_URL
    })

    const framework = new Framework({
      identity,
      network,
      userType: User,
      connectionListChannel: FrameworkChannels.ConnectionList
    })

    initApp(framework)

    Object.assign(window, { framework })

    setFramework(framework)
  }

  if (framework)
    return <AppContext.Provider
      value={{ framework }}
    >
      <Home />
    </AppContext.Provider>

  return <>
    <SetupForm
      onValidate={onValidate}
    />
  </>
}

export default App

type FormData = {
  userId: string,
  isHost: boolean,
  roomId: string
}

function SetupForm(props: { onValidate: (data: FormData) => void }) {
  const [userId, setUserId] = useState("armand")
  const [isHost, setIsHost] = useState(false)
  const [roomId, setRoomId] = useState("niloc")

  function onValidate() {
    props.onValidate({
      isHost,
      roomId,
      userId
    })
  }

  return <>
    <input type="text" value={userId} onChange={e => setUserId(e.target.value)} />
    <input type="checkbox" checked={isHost} onChange={e => setIsHost(e.target.checked)} />
    <input type="text" value={roomId} onChange={e => setRoomId(e.target.value)} />
    <button onClick={onValidate}>valider</button>
  </>
}
