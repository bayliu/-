import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-800">
      <ControlPanel />
      <InfoPanel />
      <Scene />
    </div>
  )
}

export default App;