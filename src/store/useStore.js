// /src/store/useStore.js (最終修正版)

import create from 'zustand';

const useStore = create((set, get) => ({
    // 預設物品列表
    items: [
        { id: 's-box', name: '小型箱 (S)', dimensions: { w: 0.3, h: 0.3, d: 0.3 } },
        { id: 'm-box', name: '中型箱 (M)', dimensions: { w: 0.5, h: 0.4, d: 0.4 } },
        { id: 'l-box', name: '大型箱 (L)', dimensions: { w: 0.6, h: 0.4, d: 0.45 } },
        { id: 'mattress', name: '單人床墊', dimensions: { w: 0.9, h: 1.9, d: 0.2 } },
        { id: 'fridge', name: '小冰箱', dimensions: { w: 0.6, h: 1.0, d: 0.6 } },
    ],
    // 預設倉儲空間
    storageSpaces: {
        'S': { w: 1, h: 2.5, d: 1 },
        'M': { w: 2, h: 2.5, d: 2 },
        'L': { w: 3, h: 2.5, d: 3 },
        'Custom': { w: 2, h: 2.5, d: 2 },
    },
    selectedSpace: 'M',
    itemsInScene: [],

    // --- 操作函數 (Actions) ---

    setStorageSpace: (size) => set({ selectedSpace: size, itemsInScene: [] }),

    setCustomSpace: (dims) => set((state) => ({
        storageSpaces: { ...state.storageSpaces, Custom: dims },
        selectedSpace: 'Custom',
        itemsInScene: []
    })),

    addItemToScene: (item) => {
        const { storageSpaces, selectedSpace } = get();
        const spaceDims = storageSpaces[selectedSpace];
        const newItem = {
            ...item,
            instanceId: `${item.id}-${Date.now()}`,
            position: [
                (Math.random() - 0.5) * (spaceDims.w * 0.1),
                spaceDims.h, // 修正生成高度，確保在倉庫頂部
                (Math.random() - 0.5) * (spaceDims.d * 0.1)
            ],
        };
        set((state) => ({ itemsInScene: [...state.itemsInScene, newItem] }));
    },

    removeItemFromScene: (instanceId) => set((state) => ({
        itemsInScene: state.itemsInScene.filter((item) => item.instanceId !== instanceId)
    })),

    // --- 計算函數 ---
    getCalculations: () => {
        const { storageSpaces, selectedSpace, itemsInScene } = get();
        const spaceDims = storageSpaces[selectedSpace];
        const spaceVolume = spaceDims.w * spaceDims.h * spaceDims.d;
        let itemsVolume = 0;
        let itemsCFT = 0; // CFT = Cubic Feet (材積)

        itemsInScene.forEach(item => {
            const w_m = item.dimensions.w;
            const h_m = item.dimensions.h;
            const d_m = item.dimensions.d;

            itemsVolume += w_m * h_m * d_m;

            const cft = (w_m * 100 * h_m * 100 * d_m * 100) / 28316.846592;
            itemsCFT += cft;
        });

        const usage = spaceVolume > 0 ? (itemsVolume / spaceVolume) * 100 : 0;

        return {
            spaceVolume: spaceVolume.toFixed(2),
            itemsVolume: itemsVolume.toFixed(2),
            itemsCFT: Math.round(itemsCFT),
            usage: Math.min(100, usage).toFixed(1),
        };
    },
}));

export default useStore;