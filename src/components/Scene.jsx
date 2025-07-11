// /src/components/Scene.jsx (³Ì²×ª©)

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function SceneContent() {
    const itemsInScene = useStore((state) => state.itemsInScene);
    const orbitControlsRef = useRef();

    const [activeItem, setActiveItem] = useState(null);
    const [dragPlane, setDragPlane] = useState(new THREE.Plane());
    const { raycaster } = useThree();

    useFrame(() => {
        if (activeItem) {
            const body = activeItem.ref.current;
            if (body) {
                const intersection = new THREE.Vector3();
                if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
                    body.setNextKinematicTranslation(intersection);
                }
            }
        }
    });

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
                <StorageSpace />
                {itemsInScene.map((item) => (
                    <DraggableItem
                        key={item.instanceId}
                        item={item}
                        orbitControlsRef={orbitControlsRef}
                        setActiveItem={setActiveItem}
                        setDragPlane={setDragPlane}
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