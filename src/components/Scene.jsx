import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef } from 'react'; // <--- 新增這一行

export default function Scene() {
  const itemsInScene = useStore((state) => state.itemsInScene);
  const orbitControlsRef = useRef(); // <--- 新增這一行

  return (
    <Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>
      {/* ... */}
      <OrbitControls ref={orbitControlsRef} makeDefault /> 
      {/* ... */}
      <Physics gravity={[0, -9.8, 0]}>
        <StorageSpace />
        {itemsInScene.map((item) => (
          <DraggableItem 
            key={item.instanceId} 
            item={item} 
            orbitControlsRef={orbitControlsRef} // <--- 新增這一行，把 ref 傳下去
          />
        ))}
      </Physics>
    </Canvas>
  );
}