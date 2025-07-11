import create from 'zustand';

const useStore = create((set, get) => ({
    // 預設可新增的物品範本
    items: [
        { id: 's-box', name: '小型箱 (S)', dimensions: { w: 0.3, h: 0.3, d: 0.3 } },
        { id: 'm-box', name: '中型箱 (M)', dimensions: { w: 0.5, h: 0.4, d: 0.4 } },
        { id: 'mattress', name: '單人床墊', dimensions: { w: 0.9, h: 1.9, d: 0.2 } },
        { id: 'fridge', name: '小冰箱', dimensions: { w: 0.6, h: 1.0, d: 0.6 } },
    ],
    // 預設倉儲空間尺寸 (m)
    storageSpaces: {
        'S': { w: 1, h: 2.5, d: 1 },
        'M': { w: 2, h: 2.5, d: 2 },
        'L': { w: 3, h: 2.5, d: 3 },
        'Custom': { w: 2, h: 2.5, d: 2 }, // 自訂空間的預設值
    },
    selectedSpace: 'M',
    itemsInScene: [], // 存在於 3D 場景中的物品

    // === 操作 (Actions) ===

    // 設定選擇的倉儲空間
    setStorageSpace: (size) => {
        set({ selectedSpace: size, itemsInScene: [] }); // 切換空間時清空場景
    },

    // 設定自訂空間尺寸
    setCustomSpace: (dims) => {
        set((state) => ({
            storageSpaces: { ...state.storageSpaces, Custom: dims },
            selectedSpace: 'Custom',
            itemsInScene: [],
        }));
    },

    // 新增物品到場景
    addItemToScene: (item) => {
        const { storageSpaces, selectedSpace } = get();
        const spaceDims = storageSpaces[selectedSpace];
        const newItem = {
            ...item,
            instanceId: `${item.id}-${Date.now()}`,
            // 修正生成位置，確保在倉庫正上方
            position: [
                (Math.random() - 0.5) * (spaceDims.w * 0.1), // 隨機 X
                spaceDims.h + 0.5, // 在倉庫頂部上方
                (Math.random() - 0.5) * (spaceDims.d * 0.1)  // 隨機 Z
            ],
        };
        set((state) => ({
            itemsInScene: [...state.itemsInScene, newItem],
        }));
    },

    // 從場景移除物品
    removeItemFromScene: (instanceId) => {
        set((state) => ({
            itemsInScene: state.itemsInScene.filter((item) => item.instanceId !== instanceId),
        }));
    },

    // 計算體積與使用率
    getCalculations: () => {
        const { storageSpaces, selectedSpace, itemsInScene } = get();
        const spaceDims = storageSpaces[selectedSpace];
        const spaceVolume = spaceDims.w * spaceDims.h * spaceDims.d;

        const itemsVolume = itemsInScene.reduce((total, item) => {
            // 確保體積計算公式正確 w * h * d
            return total + (item.dimensions.w * item.dimensions.h * item.dimensions.d);
        }, 0);

        const usage = spaceVolume > 0 ? (itemsVolume / spaceVolume) * 100 : 0;

        return {
            spaceVolume: spaceVolume.toFixed(2),
            itemsVolume: itemsVolume.toFixed(2),
            usage: Math.min(100, usage).toFixed(1), // 使用率最大為 100%
        };
    },
}));

export default useStore;