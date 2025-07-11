import useStore from '../store/useStore';

export default function InfoPanel() {
  const { 
    storageSpaces, 
    selectedSpace, 
    setStorageSpace,
    getCalculations,
    itemsInScene,
    removeItemFromScene
  } = useStore();
  
  const { spaceVolume, itemsVolume, usage } = getCalculations();

  return (
    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-72 z-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">空間分析</h2>
      
      <div className="mb-4">
        <label className="block font-bold mb-2 text-gray-700">選擇倉儲尺寸</label>
        <div className="flex space-x-2">
          {Object.keys(storageSpaces).map((size) => (
            <button
              key={size}
              onClick={() => setStorageSpace(size)}
              className={`flex-1 p-2 rounded transition-colors text-sm font-bold ${
                selectedSpace === size 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {size}倉
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-gray-700">空間使用率: {usage}%</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 my-1 overflow-hidden">
          <div 
            className="bg-green-500 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${usage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600">總體積: {spaceVolume} m³ | 物品體積: {itemsVolume} m³</p>
      </div>

      <div>
        <h3 className="font-bold mb-2 text-gray-700">已放置物品 ({itemsInScene.length})</h3>
        <div className="max-h-32 overflow-y-auto space-y-1 pr-2 bg-gray-50 p-2 rounded">
          {itemsInScene.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">從左側面板新增物品</p>
          ) : (
            itemsInScene.map(item => (
              <div key={item.instanceId} className="flex justify-between items-center bg-white p-1 rounded shadow-sm text-sm">
                <span className="text-gray-800">{item.name}</span>
                <button 
                  onClick={() => removeItemFromScene(item.instanceId)}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}