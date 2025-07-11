// /src/App.jsx (穩定版)

import Scene from './components/Scene'; // <-- 確保引入的是 Scene
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900">
            <ControlPanel />
            <InfoPanel />
            <Scene /> {/* <-- 確保使用的是 Scene */}
        </div>
    )
}

export default App;