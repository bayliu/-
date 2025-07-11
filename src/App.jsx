// /src/App.jsx (í�w��)

import Scene from './components/Scene'; // <-- �T�O�ޤJ���O Scene
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900">
            <ControlPanel />
            <InfoPanel />
            <Scene /> {/* <-- �T�O�ϥΪ��O Scene */}
        </div>
    )
}

export default App;