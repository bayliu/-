// /src/App.jsx (修正引入)

import SceneWrapper from './components/Scene'; // <-- 修改這裡的引入名稱
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900">
            <ControlPanel />
            <InfoPanel />
            <SceneWrapper /> {/* <-- 修改這裡的元件名稱 */}
        </div>
    )
}

export default App;