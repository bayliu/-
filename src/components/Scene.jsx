// /src/components/Scene.jsx (�̲����Ҫ� v5 - í�w�l��)

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// �Ыؤ@�Ӭݤ������ƹ��l�ܾ�
function MouseTracker() {
    const trackerRef = useRef();

    useFrame(({ mouse, viewport }) => {
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        // ���l�ܾ��b�@�өT�w�����פW���H�ƹ�
        // �`�N�G�o�Ӱl�ܾ��S�����z�S�ʡA�u�O�@�ӵ�ı�W���I
        if (trackerRef.current) {
            // �o�O�@��²�ƪ��l�ܡA���T���ݭn raycaster�A���ڭ̥��γo��í�w��
            // trackerRef.current.position.set(x, 1, y);
        }
    });

    return (
        <mesh ref={trackerRef} visible={false}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial />
        </mesh>
    );
}


export default function Scene() {
    const itemsInScene = useStore((state) => state.itemsInScene);
    const orbitControlsRef = useRef();

    // �Τ@�� state �Ӱl�ܷ�e�O�_������b�Q�즲
    const [isDragging, setIsDragging] = useState(false);
    const { raycaster, camera } = useThree();

    // useFrame(({raycaster, camera}) => {
    //     if(isDragging){
    //         const plane = new THREE.Plane(new THREE.Vector3(0,1,0), -1)
    //         const intersection = new THREE.Vector3();
    //         if (raycaster.ray.intersectPlane(plane, intersection)) {
    //             console.log(intersection)
    //         }
    //     }
    // })

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
            <OrbitControls ref={orbitControlsRef} makeDefault enabled={true} />
            <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />

            <Physics gravity={[0, -9.8, 0]}>
                <StorageSpace />
                {itemsInScene.map((item) => (
                    <DraggableItem
                        key={item.instanceId}
                        item={item}
                        orbitControlsRef={orbitControlsRef}
                        // �N setDragging ��ƶǻ��U�h
                        setDragging={setIsDragging}
                    />
                ))}
            </Physics>
            {/* ��J�ƹ��l�ܾ� */}
            {/* <MouseTracker /> */}
        </>
    );
}

// ���F�� Scene �b Canvas ������X�ݨ� useThree hook�A�ڭ̻ݭn�A�]�ˤ@�h
const SceneWrapper = () => {
    return (
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>
            <Scene />
        </Canvas>
    )
}

export { SceneWrapper as default };