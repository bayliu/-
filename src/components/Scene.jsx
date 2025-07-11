// /src/components/Scene.jsx (í�w��)

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics, CuboidCollider } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef } from 'react';

// �ڭ̱N�Ҧ��޿��^ Scene�A���A�ݭn SceneContent
export default function Scene() {
    const itemsInScene = useStore((state) => state.itemsInScene);
    const orbitControlsRef = useRef();

    return (
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[5, 10, 7]}
                intensity={1.0}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <OrbitControls ref={orbitControlsRef} makeDefault />
            <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />

            <Physics gravity={[0, -9.8, 0]}>
                {/* �z�������j�a���A�����~���|���U�h */}
                <CuboidCollider
                    args={[100, 0.1, 100]}
                    position={[0, -0.1, 0]}
                />

                <StorageSpace />
                {itemsInScene.map((item) => (
                    <DraggableItem
                        key={item.instanceId}
                        item={item}
                        orbitControlsRef={orbitControlsRef}
                    />
                ))}
            </Physics>
        </Canvas>
    );
}