// /src/App.jsx (�ץ��ޤJ)

import SceneWrapper from './components/Scene'; // <-- �ק�o�̪��ޤJ�W��
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900">
            <ControlPanel />
            <InfoPanel />
            <SceneWrapper /> {/* <-- �ק�o�̪�����W�� */}
        </div>
    )
}

export default App;