import { useState } from 'react'
import './App.css'
import { GameManager } from './game/GameManager'
import { GameManagerHost } from './game/GameManagerHost'
import { GameView } from './components/GameView'

export const App = () => {
  const [gameManager, setGameManager] = useState<GameManager | null>(null)

  function onHost() {
    setGameManager(new GameManagerHost())
  }

  function onJoin() {
    setGameManager(new GameManager())
  }

  return <div className="App">
    {
      gameManager === null && <>
        <button onClick={onHost}>Host</button>
        <button onClick={onJoin}>Join</button>
      </>
    }
    {
      gameManager && <GameView gameManager={gameManager} />
    }
  </div>
}
