// /src/components/Scene.jsx (最終驗證版)

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef } from 'react';

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
            {/* 將 ref 綁定到 OrbitControls，並預設啟用 */}
            <OrbitControls ref={orbitControlsRef} makeDefault enabled={true} />
            <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />

            <Physics gravity={[0, -9.8, 0]}>
                <StorageSpace />
                {itemsInScene.map((item) => (
                    <DraggableItem
                        key={item.instanceId}
                        item={item}
                        // 將 orbitControlsRef 傳遞給每一個物品
                        orbitControlsRef={orbitControlsRef}
                    />
                ))}
            </Physics>
        </Canvas>
    );
}