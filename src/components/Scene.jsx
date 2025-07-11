// /src/components/Scene.jsx (�̲װ��|�ץ���)

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
                {/* VVVVVVVV �֤߭ק�G�N�a���q�ª��z�I����אּ�i���� Mesh VVVVVV */}
                {/* �ڭ������D�`�j�A���z���A�o�ˮg�u�~�఻���쥦 */}
                <RigidBody type="fixed" colliders="cuboid" userData={{ isStackable: true }}>
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[200, 0.1, 200]} />
                        <meshStandardMaterial transparent opacity={0} />
                    </mesh>
                </RigidBody>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}

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