// /src/App.jsx

import Scene from './components/Scene'; // <-- 引入預設導出的 Scene
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900">
            <ControlPanel />
            <InfoPanel />
            <Scene /> {/* <-- 使用 Scene 元件 */}
        </div>
    )
}

export default App;