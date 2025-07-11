// /src/components/Scene.jsx (�̲����Ҫ�)

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
            {/* �N ref �j�w�� OrbitControls�A�ùw�]�ҥ� */}
            <OrbitControls ref={orbitControlsRef} makeDefault enabled={true} />
            <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />

            <Physics gravity={[0, -9.8, 0]}>
                <StorageSpace />
                {itemsInScene.map((item) => (
                    <DraggableItem
                        key={item.instanceId}
                        item={item}
                        // �N orbitControlsRef �ǻ����C�@�Ӫ��~
                        orbitControlsRef={orbitControlsRef}
                    />
                ))}
            </Physics>
        </Canvas>
    );
}