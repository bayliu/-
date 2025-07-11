// /src/components/Scene.jsx (最終驗證版 - useDrag)

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics, CuboidCollider } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef } from 'react';

function SceneContent() {
    const itemsInScene = useStore((state) => state.itemsInScene);
    const orbitControlsRef = useRef();

    return (
        <>
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
                {/* VVVVVV 新增一個巨大的、看不見的地面 VVVVVV */}
                <CuboidCollider
                    args={[100, 0.1, 100]}
                    position={[0, -0.1, 0]}
                    restitution={0.1}
                />
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}

                <StorageSpace />
                {itemsInScene.map((item) => (
                    <DraggableItem
                        key={item.instanceId}
                        item={item}
                        orbitControlsRef={orbitControlsRef}
                    />
                ))}
            </Physics>
        </>
    );
}

export default function Scene() {
    return (
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>
            <SceneContent />
        </Canvas>
    )
}