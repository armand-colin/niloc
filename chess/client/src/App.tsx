import { useMemo, useState } from 'react'
import './App.css'
import { GameManager } from './game/GameManager'
import { GameManagerHost } from './game/GameManagerHost'
import { GameView } from './components/GameView'
import { PieceColor, PieceShape } from './game/Piece'
import { Button } from './components/atoms/Button'
import { useUrl } from './hooks/useUrl'
import pawn from "../assets/pieces/pawn.svg"
import { PieceView } from './components/PieceView'
import { RawPieceView } from './components/RawPieceView'
import { Input } from './components/atoms/Input'

enum Phase {
  Config,
  Host,
  Game
}

const params = new URLSearchParams(location.search)
let url = params.get("url")

const startingPhase = url ? Phase.Host : Phase.Config

export const App = () => {
  const [phase, setPhase] = useState(startingPhase)
  const [host, setHost] = useState(false)

  const body = useMemo(() => {
    switch (phase) {
      case Phase.Config: {
        return <ConfigPhase
          submit={(url) => {
            params.set("url", url)
            window.location.assign(`${window.location.origin}${window.location.pathname}?${params.toString()}`)
          }}
        />
      }
      case Phase.Host: {
        return <HostPhase
          submit={(host) => {
            setHost(host)
            setPhase(Phase.Game)
          }}
        />
      }
      case Phase.Game: {
        return <GamePhase
          url={url!}
          host={host}
        />
      }
    }
  }, [phase])

  return <div className="App">
    {body}
  </div>
}

const ConfigPhase = (props: { submit: (url: string) => void }) => {
  const [url, setUrl] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    props.submit(url)
  }

  return <div className="ConfigPhase">
    <form onSubmit={onSubmit}>
      <Input type="text" placeholder='URL' value={url} onChange={e => setUrl(e.target.value)} />
      <Button>Validate</Button>
    </form>
  </div>
}

const HostPhase = (props: { submit: (host: boolean) => void }) => {

  return <div className="HostPhase">
    <Button onClick={() => props.submit(true)}>
      <RawPieceView
        shape={PieceShape.Queen}
        color={PieceColor.White}
      />
      Host
    </Button>
    <Button onClick={() => props.submit(false)}>
      <RawPieceView
        shape={PieceShape.King}
        color={PieceColor.Black}
      />
      Join
    </Button>
  </div>
}

let gameManagerInstance: GameManager | null = null
const GamePhase = (props: { url: string, host: boolean }) => {
  const gameManager = useMemo(() => {
    if (!gameManagerInstance)
      gameManagerInstance = props.host ?
        new GameManagerHost(props.url, PieceColor.White) :
        new GameManager(props.url, PieceColor.Black)

    return gameManagerInstance
  }, [])

  return <div className="GamePhase">
    <GameView
      gameManager={gameManager}
    />
  </div>
}