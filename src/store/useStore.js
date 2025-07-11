// /src/store/useStore.js (新增材積計算)

import create from 'zustand';

const useStore = create((set, get) => ({
    // ... 其他 state 保持不變 ...
    items: [
        { id: 's-box', name: '小型箱 (S)', dimensions: { w: 0.3, h: 0.3, d: 0.3 } },
        { id: 'm-box', name: '中型箱 (M)', dimensions: { w: 0.5, h: 0.4, d: 0.4 } },
        { id: 'mattress', name: '單人床墊', dimensions: { w: 0.9, h: 1.9, d: 0.2 } },
        { id: 'fridge', name: '小冰箱', dimensions: { w: 0.6, h: 1.0, d: 0.6 } },
    ],
    storageSpaces: {
        'S': { w: 1, h: 2.5, d: 1 },
        'M': { w: 2, h: 2.5, d: 2 },
        'L': { w: 3, h: 2.5, d: 3 },
        'Custom': { w: 2, h: 2.5, d: 2 },
    },
    selectedSpace: 'M',
    itemsInScene: [],

    // --- Actions (保持不變) ---
    setStorageSpace: (size) => { set({ selectedSpace: size, itemsInScene: [] }); },
    setCustomSpace: (dims) => { set((state) => ({ storageSpaces: { ...state.storageSpaces, Custom: dims }, selectedSpace: 'Custom', itemsInScene: [] })); },
    addItemToScene: (item) => { /* ... 保持不變 ... */ },
    removeItemFromScene: (instanceId) => { /* ... 保持不變 ... */ },

    // --- 計算函數 (核心修改) ---
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

            // 1. 計算 m³ 體積
            itemsVolume += w_m * h_m * d_m;

            // 2. 計算材積 (CFT)
            const w_cm = w_m * 100;
            const h_cm = h_m * 100;
            const d_cm = d_m * 100;
            const cft = (w_cm * h_cm * d_cm) / 28316.846592; // 使用更精確的除數
            itemsCFT += cft;
        });

        const usage = spaceVolume > 0 ? (itemsVolume / spaceVolume) * 100 : 0;

        return {
            spaceVolume: spaceVolume.toFixed(2),
            itemsVolume: itemsVolume.toFixed(2),
            // 新增回傳總材積，並四捨五入到整數
            itemsCFT: Math.round(itemsCFT),
            usage: Math.min(100, usage).toFixed(1),
        };
    },
}));

// 這裡的 addItemToScene 和 removeItemFromScene 的函數體可以從您現有的文件中複製過來，它們不需要修改
// 為了簡潔，我省略了它們的函數體，但請確保您的文件中它們是完整的。
// 我將完整的函數體放在這裡，以防萬一
useStore.setState({
    addItemToScene: (item) => {
        const { storageSpaces, selectedSpace } = useStore.getState();
        const spaceDims = storageSpaces[selectedSpace];
        const newItem = {
            ...item,
            instanceId: `${item.id}-${Date.now()}`,
            position: [
                (Math.random() - 0.5) * (spaceDims.w * 0.1),
                spaceDims.h + 0.5,
                (Math.random() - 0.5) * (spaceDims.d * 0.1)
            ],
        };
        useStore.setState((state) => ({ itemsInScene: [...state.itemsInScene, newItem] }));
    },
    removeItemFromScene: (instanceId) => {
        useStore.setState((state) => ({
            itemsInScene: state.itemsInScene.filter((item) => item.instanceId !== instanceId),
        }));
    }
});

export default useStore;