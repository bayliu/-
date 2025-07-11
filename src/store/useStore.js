import create from 'zustand';

const useStore = create((set, get) => ({
  items: [
    { id: 1, name: '小型箱 (S)', dimensions: { w: 0.3, h: 0.3, d: 0.3 } },
    { id: 2, name: '中型箱 (M)', dimensions: { w: 0.5, h: 0.4, d: 0.4 } },
    { id: 3, name: '單人床墊', dimensions: { w: 0.9, h: 1.9, d: 0.2 } },
    { id: 4, name: '小冰箱', dimensions: { w: 0.6, h: 1.0, d: 0.6 } },
  ],
  storageSpaces: {
    'S': { w: 1, h: 2.5, d: 1 },
    'M': { w: 2, h: 2.5, d: 2 },
    'L': { w: 3, h: 2.5, d: 3 },
  },
  selectedSpace: 'M',
  itemsInScene: [],

  setStorageSpace: (size) => {
    set({ selectedSpace: size, itemsInScene: [] });
  },

  addItemToScene: (item) => {
    const { storageSpaces, selectedSpace } = get();
    const spaceDims = storageSpaces[selectedSpace];
    const newItem = {
      ...item,
      instanceId: `${item.id}-${Date.now()}`,
      position: [
        (Math.random() - 0.5) * (spaceDims.w * 0.2),
        spaceDims.h,
        (Math.random() - 0.5) * (spaceDims.d * 0.2)
      ],
    };
    set((state) => ({ itemsInScene: [...state.itemsInScene, newItem] }));
  },

  removeItemFromScene: (instanceId) => {
    set((state) => ({
      itemsInScene: state.itemsInScene.filter((item) => item.instanceId !== instanceId),
    }));
  },
  
  getCalculations: () => {
    const { storageSpaces, selectedSpace, itemsInScene } = get();
    const spaceDims = storageSpaces[selectedSpace];
    const spaceVolume = spaceDims.w * spaceDims.h * spaceDims.d;

    const itemsVolume = itemsInScene.reduce((total, item) => {
      return total + (item.dimensions.w * item.dimensions.d * item.dimensions.h);
    }, 0);

    const usage = spaceVolume > 0 ? (itemsVolume / spaceVolume) * 100 : 0;

    return {
      spaceVolume: spaceVolume.toFixed(2),
      itemsVolume: itemsVolume.toFixed(2),
      usage: Math.min(100, usage).toFixed(1),
    };
  },
}));

export default useStore;