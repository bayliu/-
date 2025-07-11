// /src/App.jsx

import Scene from './components/Scene'; // <-- �ޤJ�w�]�ɥX�� Scene
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900">
            <ControlPanel />
            <InfoPanel />
            <Scene /> {/* <-- �ϥ� Scene ���� */}
        </div>
    )
}

export default App;