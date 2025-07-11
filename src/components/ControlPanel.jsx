// /src/components/ControlPanel.jsx (最終版 - 新增尺寸說明)

import { useState } from 'react';
import useStore from '../store/useStore';

export default function ControlPanel() {
    const { items, addItemToScene } = useStore((state) => ({
        items: state.items,
        addItemToScene: state.addItemToScene,
    }));

    const [customItem, setCustomItem] = useState({ name: '我的物品', w: 50, d: 50, h: 50 });

    const handleCustomChange = (e) => setCustomItem({ ...customItem, [e.target.name]: e.target.value });

    const handleAddCustomItem = (e) => {
        e.preventDefault();
        const newItem = {
            id: `custom-${Date.now()}`,
            name: customItem.name,
            dimensions: {
                w: parseFloat(customItem.w) / 100,
                h: parseFloat(customItem.h) / 100,
                d: parseFloat(customItem.d) / 100,
            },
        };
        if (newItem.dimensions.w > 0 && newItem.dimensions.h > 0 && newItem.dimensions.d > 0) {
            addItemToScene(newItem);
        } else {
            alert("請輸入所有有效的正數尺寸！");
        }
    };

    return (
        <div className="absolute top-4 left-4 bg-gray-800/70 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg w-72 z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center border-b border-gray-600 pb-2">新增物品</h2>

            <div className="space-y-3 mb-4">
                {items.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => addItemToScene(item)}
                            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md"
                        >
                            {item.name}
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-1">
                            {`(寬${item.dimensions.w * 100}*長${item.dimensions.d * 100}*高${item.dimensions.h * 100}cm)`}
                        </p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddCustomItem} className="bg-gray-700/50 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-center">自訂物品</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <label className="block text-gray-300 mb-1">物品名稱</label>
                        <input type="text" name="name" value={customItem.name} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-gray-300 mb-1">寬(cm)</label>
                            <input type="number" name="w" min="1" value={customItem.w} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">長(cm)</label>
                            <input type="number" name="d" min="1" value={customItem.d} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">高(cm)</label>
                            <input type="number" name="h" min="1" value={customItem.h} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition-all duration-200 shadow-md">
                    新增自訂物品
                </button>
            </form>

            <div className="text-xs text-gray-300 mt-4 p-3 bg-gray-700/50 rounded-lg">
                <h4 className="font-bold text-gray-100 mb-1">操作提示</h4>
                <p>- <span className="font-semibold">拖曳空白處:</span> 旋轉視角</p>
                <p>- <span className="font-semibold">滑鼠滾輪:</span> 縮放視角</p>
                <p>- <span className="font-semibold">左鍵拖曳物品:</span> 移動</p>
                <p>- <span className="font-semibold">右鍵點擊物品:</span> 旋轉</p>
            </div>
        </div>
    );
}