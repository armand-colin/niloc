import "./state/State"
import './App.css'
import { Canvas } from './components/Canvas'
import { UserList } from './components/UserList'

function App() {
  return <div class="App">
    <Canvas />
    <UserList />
  </div>
}

export default App
