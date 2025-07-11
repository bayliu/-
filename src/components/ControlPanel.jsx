import { useState } from 'react';
import useStore from '../store/useStore';

export default function ControlPanel() {
    const { items, addItemToScene } = useStore((state) => ({
        items: state.items,
        addItemToScene: state.addItemToScene,
    }));

    const [customItem, setCustomItem] = useState({
        name: '我的物品',
        w: 50, // 寬
        d: 50, // 長(深)
        h: 50, // 高
    });

    const handleCustomChange = (e) => {
        setCustomItem({ ...customItem, [e.target.name]: e.target.value });
    };

    const handleAddCustomItem = (e) => {
        e.preventDefault();
        const newItem = {
            id: `custom-${Date.now()}`,
            name: customItem.name,
            dimensions: {
                w: parseFloat(customItem.w) / 100, // 從 cm 轉換為 m
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
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-64 z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">新增物品</h2>
            {/* 預設物品 */}
            <div className="space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => addItemToScene(item)}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            {/* 分隔線 */}
            <hr className="my-4 border-gray-300" />

            {/* 自訂物品表單 */}
            <form onSubmit={handleAddCustomItem}>
                <h3 className="text-lg font-bold mb-2 text-gray-800">自訂物品</h3>
                <div className="space-y-2 text-sm">
                    <div>
                        <label className="block text-gray-700">物品名稱</label>
                        <input type="text" name="name" value={customItem.name} onChange={handleCustomChange} className="w-full p-1 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">寬 (cm)</label>
                        <input type="number" name="w" min="1" value={customItem.w} onChange={handleCustomChange} className="w-full p-1 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">長/深 (cm)</label>
                        <input type="number" name="d" min="1" value={customItem.d} onChange={handleCustomChange} className="w-full p-1 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">高 (cm)</label>
                        <input type="number" name="h" min="1" value={customItem.h} onChange={handleCustomChange} className="w-full p-1 border rounded" required />
                    </div>
                </div>
                <button type="submit" className="w-full mt-3 bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition-colors">
                    新增自訂物品
                </button>
            </form>

            {/* 操作提示 */}
            <div className="text-xs text-gray-600 mt-4 p-2 bg-gray-100 rounded">
                <h4 className="font-bold">操作提示：</h4>
                <p>- 拖曳滑鼠 旋轉視角</p>
                <p>- 滾輪 縮放視角</p>
                <p>- 左鍵點住物品 拖曳移動</p>
                <p>- 右鍵點擊物品 旋轉90度</p>
            </div>
        </div>
    );
}