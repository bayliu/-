// /src/components/InfoPanel.jsx (修正重複匯出錯誤)

import { useState, useEffect } from 'react';
import useStore from '../store/useStore';

export default function InfoPanel() {
    const {
        storageSpaces, selectedSpace, setStorageSpace,
        getCalculations, itemsInScene, removeItemFromScene, setCustomSpace
    } = useStore();

    const { spaceVolume, itemsVolume, itemsCFT, usage } = getCalculations();

    const [customDims, setCustomDims] = useState({
        w: storageSpaces.Custom.w * 100,
        h: storageSpaces.Custom.h * 100,
        d: storageSpaces.Custom.d * 100,
    });

    useEffect(() => {
        const currentDims = storageSpaces[selectedSpace];
        if (currentDims) {
            setCustomDims({
                w: currentDims.w * 100,
                h: currentDims.h * 100,
                d: currentDims.d * 100,
            });
        }
    }, [selectedSpace, storageSpaces]);

    const handleCustomDimChange = (e) => {
        setCustomDims({ ...customDims, [e.target.name]: e.target.value });
    };

    const handleApplyCustomSpace = (e) => {
        e.preventDefault();
        const newDims = {
            w: parseFloat(customDims.w) / 100,
            h: parseFloat(customDims.h) / 100,
            d: parseFloat(customDims.d) / 100,
        };
        if (newDims.w > 0 && newDims.h > 0 && newDims.d > 0) {
            setCustomSpace(newDims);
        } else {
            alert("請輸入所有有效的空間尺寸！");
        }
    };

    return (
        <div className="absolute top-4 right-4 bg-gray-800/70 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg w-80 z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center border-b border-gray-600 pb-2">空間分析</h2>

            <div className="mb-4">
                <label className="block font-semibold mb-2 text-center">選擇預設尺寸</label>
                <div className="grid grid-cols-3 gap-2">
                    {Object.keys(storageSpaces).filter(s => s !== 'Custom').map((size) => (
                        <button
                            key={size}
                            onClick={() => setStorageSpace(size)}
                            className={`p-3 rounded-lg transition-all duration-200 shadow-md text-sm font-bold ${selectedSpace === size
                                    ? 'bg-green-500 text-white ring-2 ring-white/50'
                                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                }`}
                        >
                            {size}倉
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleApplyCustomSpace} className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold mb-3 text-center">或自訂空間尺寸</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                        <label className="block text-gray-300 mb-1">寬(cm)</label>
                        <input type="number" name="w" min="1" value={customDims.w} onChange={handleCustomDimChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">長(cm)</label>
                        <input type="number" name="d" min="1" value={customDims.d} onChange={handleCustomDimChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">高(cm)</label>
                        <input type="number" name="h" min="1" value={customDims.h} onChange={handleCustomDimChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                </div>
                <button type="submit" className={`w-full mt-3 text-sm text-white p-2 rounded-lg transition-all duration-200 shadow-md ${selectedSpace === 'Custom' ? 'bg-green-500 ring-2 ring-white/50' : 'bg-gray-600 hover:bg-gray-500'}`}>
                    套用自訂尺寸
                </button>
            </form>

            <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-100 text-center">空間使用率: {usage}%</h3>
                <div className="w-full bg-gray-900 rounded-full h-4 my-2 overflow-hidden border border-gray-600">
                    <div
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${usage}%` }}
                    ></div>
                </div>
                <div className="text-xs text-gray-400 text-center space-y-1">
                    <p>總體積: {spaceVolume} m³ / 物品: {itemsVolume} m³</p>
                    <p className="font-bold text-emerald-300">預估總材積: {itemsCFT} 材</p>
                </div>
            </div>

            <div>
                <h3 className="font-bold mb-2 text-gray-100 text-center">已放置物品 ({itemsInScene.length})</h3>
                <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-gray-900/50 rounded-lg border border-gray-700">
                    {itemsInScene.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">請從左側新增物品</p>
                    ) : (
                        itemsInScene.map(item => (
                            <div key={item.instanceId} className="flex justify-between items-center bg-gray-700 p-2 rounded-md shadow-sm text-sm">
                                <span className="text-gray-200 truncate pr-2">{item.name}</span>
                                <button
                                    onClick={() => removeItemFromScene(item.instanceId)}
                                    className="text-red-400 hover:text-red-300 font-bold px-2 flex-shrink-0"
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