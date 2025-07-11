// /src/App.jsx (�ץ��� - ��_ InfoPanel)

import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel'; // <--- �T�O�o��s�b

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900"> {/* �I����ձo��`�@�I */}
            <ControlPanel />
            <InfoPanel /> {/* <--- �T�O�o�Ӥ���Q��V */}
            <Scene />
        </div>
    )
}

export default App;