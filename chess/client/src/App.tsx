import { useState } from 'react'
import './App.css'
import { GameManager } from './game/GameManager'
import { GameManagerHost } from './game/GameManagerHost'
import { GameView } from './components/GameView'
import { PieceColor } from './game/Piece'

export const App = () => {
  const [gameManager, setGameManager] = useState<GameManager | null>(null)

  function onHost() {
    setGameManager(new GameManagerHost(PieceColor.White))
  }

  function onJoin() {
    setGameManager(new GameManager(PieceColor.Black))
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
