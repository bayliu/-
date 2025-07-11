import useStore from '../store/useStore';

export default function ControlPanel() {
  const { items, addItemToScene } = useStore((state) => ({
    items: state.items,
    addItemToScene: state.addItemToScene,
  }));

  return (
    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-64 z-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">新增物品</h2>
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
       <div className="text-xs text-gray-600 mt-4 p-2 bg-gray-100 rounded">
         <h4 className="font-bold">操作提示：</h4>
         <p>- <b>拖曳滑鼠</b> 旋轉視角</p>
         <p>- <b>滾輪</b> 縮放視角</p>
         <p>- <b>左鍵點住物品</b> 拖曳移動</p>
         <p>- <b>右鍵點擊物品</b> 旋轉90度</p>
       </div>
    </div>
  );
}