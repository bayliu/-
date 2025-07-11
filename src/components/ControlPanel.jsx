// /src/components/ControlPanel.jsx (最終修正版 - 修正重複匯出錯誤)

import { useState } from 'react';
import useStore from '../store/useStore';

// 創建一個可重複使用的物品按鈕元件
function ItemButton({ item, onAdd }) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
                <div className="flex-grow">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {`寬${item.dimensions.w * 100}*長${item.dimensions.d * 100}*高${item.dimensions.h * 100}cm`}
                    </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-14 p-1 text-center bg-gray-800 border border-gray-600 rounded-md"
                    />
                    <button
                        onClick={() => onAdd(item, quantity)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-500 transition-all duration-200 shadow-md"
                    >
                        新增
                    </button>
                </div>
            </div>
        </div>
    );
}

// 這是 ControlPanel 元件唯一的預設導出
export default function ControlPanel() {
    const { items, addItemToScene } = useStore();
    const [customItem, setCustomItem] = useState({ name: '我的物品', w: 50, d: 50, h: 50 });

    const handleCustomChange = (e) => setCustomItem({ ...customItem, [e.target.name]: e.target.value });

    const handleAddCustomItem = (e) => {
        e.preventDefault();
        const newItem = {
            id: `custom-${Date.now()}`,
            name: customItem.name,
            dimensions: { w: parseFloat(customItem.w) / 100, h: parseFloat(customItem.h) / 100, d: parseFloat(customItem.d) / 100 },
        };
        if (newItem.dimensions.w > 0 && newItem.dimensions.h > 0 && newItem.dimensions.d > 0) {
            addItemToScene(newItem, 1);
        } else {
            alert("請輸入所有有效的正數尺寸！");
        }
    };

    return (
        <div className="absolute top-4 left-4 bg-gray-800/70 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg w-96 z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center border-b border-gray-600 pb-2">新增物品</h2>

            <div className="space-y-3 mb-4">
                {items.map((item) => (
                    <ItemButton key={item.id} item={item} onAdd={addItemToScene} />
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