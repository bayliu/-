// /src/App.jsx (修正版 - 恢復 InfoPanel)

import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel'; // <--- 確保這行存在

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900"> {/* 背景色調得更深一點 */}
            <ControlPanel />
            <InfoPanel /> {/* <--- 確保這個元件被渲染 */}
            <Scene />
        </div>
    )
}

export default App;