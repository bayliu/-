// /src/components/InfoPanel.jsx (新增自訂空間功能)

import { useState, useEffect } from 'react';
import useStore from '../store/useStore';

export default function InfoPanel() {
    const {
        storageSpaces,
        selectedSpace,
        setStorageSpace,
        getCalculations,
        itemsInScene,
        removeItemFromScene,
        setCustomSpace // <--- 取得新函數
    } = useStore();

    const { spaceVolume, itemsVolume, usage } = getCalculations();

    const [customDims, setCustomDims] = useState({
        w: storageSpaces.Custom.w * 100,
        h: storageSpaces.Custom.h * 100,
        d: storageSpaces.Custom.d * 100,
    });

    useEffect(() => {
        // 當切換到非自訂尺寸時，同步更新自訂輸入框的值
        if (selectedSpace !== 'Custom') {
            const currentDims = storageSpaces[selectedSpace];
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
            alert("請輸入有效的空間尺寸！");
        }
    };

    return (
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-72 z-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800">空間分析</h2>

            {/* 預設尺寸選擇 */}
            <div className="mb-4">
                <label className="block font-bold mb-2 text-gray-700">選擇倉儲尺寸</label>
                <div className="flex space-x-2">
                    {Object.keys(storageSpaces).filter(s => s !== 'Custom').map((size) => (
                        <button
                            key={size}
                            onClick={() => setStorageSpace(size)}
                            className={`flex-1 p-2 rounded transition-colors text-sm font-bold ${selectedSpace === size
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {size}倉
                        </button>
                    ))}
                </div>
            </div>

            {/* 自訂空間表單 */}
            <form onSubmit={handleApplyCustomSpace} className="mb-4 p-3 bg-gray-50 rounded">
                <h3 className="font-bold mb-2 text-gray-700">或自訂空間尺寸</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                        <label className="block text-gray-600">長(cm)</label>
                        <input type="number" name="d" value={customDims.d} onChange={handleCustomDimChange} className="w-full p-1 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-600">寬(cm)</label>
                        <input type="number" name="w" value={customDims.w} onChange={handleCustomDimChange} className="w-full p-1 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-600">高(cm)</label>
                        <input type="number" name="h" value={customDims.h} onChange={handleCustomDimChange} className="w-full p-1 border rounded" />
                    </div>
                </div>
                <button type="submit" className="w-full mt-2 text-sm bg-gray-500 text-white p-1 rounded hover:bg-gray-600">
                    套用自訂尺寸
                </button>
            </form>

            {/* 空間使用率 */}
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

            {/* 物品列表 */}
            <div>
                {/* ... 物品列表部分保持不變 ... */}
            </div>
        </div>
    );
}