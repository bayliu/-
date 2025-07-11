import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef } from 'react'; // <--- �s�W�o�@��

export default function Scene() {
  const itemsInScene = useStore((state) => state.itemsInScene);
  const orbitControlsRef = useRef(); // <--- �s�W�o�@��

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
            orbitControlsRef={orbitControlsRef} // <--- �s�W�o�@��A�� ref �ǤU�h
          />
        ))}
      </Physics>
    </Canvas>
  );
}