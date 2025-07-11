// /src/components/ControlPanel.jsx (響應式最終版)

import { useState } from 'react';
import useStore from '../store/useStore';

function ItemButton({ item, onAdd }) {
    // ... ItemButton 元件保持不變 ...
}

// 接收 isOpen 和 onClose props
export default function ControlPanel({ isOpen, onClose }) {
    // ... 內部邏輯和 state 保持不變 ...

    return (
        <>
            {/* 手機版滑出時的背景遮罩 */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={onClose}
                ></div>
            )}

            {/* 核心修改：使用 TailwindCSS 的響應式 class */}
            <div className={`
        fixed top-0 left-0 h-full bg-gray-800 text-white p-4 shadow-lg w-80 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-96 md:h-auto md:bg-gray-800/70 
        md:backdrop-blur-sm md:rounded-xl md:max-h-[calc(100vh-2rem)] 
        md:top-4 md:left-4 md:z-10 overflow-y-auto
      `}>
                <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
                    <h2 className="text-xl font-bold">新增物品</h2>
                    {/* 手機版專用的關閉按鈕 */}
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ... 面板的其他內容保持不變 ... */}

            </div>
        </>
    );
}


// 為了方便您直接複製貼上，這裡提供完整的 ControlPanel.jsx 內容
const FullControlPanel = ({ isOpen, onClose }) => {
    const { items, addItemToScene } = useStore();
    const [customItem, setCustomItem] = useState({ name: '我的物品', w: 50, d: 50, h: 50 });
    const handleCustomChange = (e) => setCustomItem({ ...customItem, [e.target.name]: e.target.value });
    const handleAddCustomItem = (e) => {
        e.preventDefault();
        const newItem = {
            id: `custom-${Date.now()}`, name: customItem.name,
            dimensions: { w: parseFloat(customItem.w) / 100, h: parseFloat(customItem.h) / 100, d: parseFloat(customItem.d) / 100 },
        };
        if (newItem.dimensions.w > 0 && newItem.dimensions.h > 0 && newItem.dimensions.d > 0) {
            addItemToScene(newItem, 1);
        } else { alert("請輸入所有有效的正數尺寸！"); }
    };

    const ItemButton = ({ item, onAdd }) => {
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
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-14 p-1 text-center bg-gray-800 border border-gray-600 rounded-md" />
                        <button onClick={() => onAdd(item, quantity)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-500 transition-all duration-200 shadow-md">新增</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={onClose}></div>}
            <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 shadow-lg w-80 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-96 md:h-auto md:bg-gray-800/70 md:backdrop-blur-sm md:rounded-xl md:max-h-[calc(100vh-2rem)] md:top-4 md:left-4 md:z-10 overflow-y-auto`}>
                <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
                    <h2 className="text-xl font-bold">新增物品</h2>
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="space-y-3 mb-4">
                    {items.map((item) => (<ItemButton key={item.id} item={item} onAdd={addItemToScene} />))}
                </div>
                <form onSubmit={handleAddCustomItem} className="bg-gray-700/50 p-3 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-center">自訂物品</h3>
                    <div className="space-y-3 text-sm">
                        <div><label className="block text-gray-300 mb-1">物品名稱</label><input type="text" name="name" value={customItem.name} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                        <div className="grid grid-cols-3 gap-2">
                            <div><label className="block text-gray-300 mb-1">寬(cm)</label><input type="number" name="w" min="1" value={customItem.w} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                            <div><label className="block text-gray-300 mb-1">長(cm)</label><input type="number" name="d" min="1" value={customItem.d} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                            <div><label className="block text-gray-300 mb-1">高(cm)</label><input type="number" name="h" min="1" value={customItem.h} onChange={handleCustomChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition-all duration-200 shadow-md">新增自訂物品</button>
                </form>
                <div className="text-xs text-gray-300 mt-4 p-3 bg-gray-700/50 rounded-lg">
                    <h4 className="font-bold text-gray-100 mb-1">操作提示</h4>
                    <p>- <span className="font-semibold">拖曳空白處:</span> 旋轉視角</p>
                    <p>- <span className="font-semibold">滑鼠滾輪:</span> 縮放視角</p>
                    <p>- <span className="font-semibold">左鍵拖曳物品:</span> 移動</p>
                    <p>- <span className="font-semibold">右鍵點擊物品:</span> 旋轉</p>
                </div>
            </div>
        </>
    );
}
export { FullControlPanel as default };