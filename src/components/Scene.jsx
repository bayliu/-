// /src/components/Scene.jsx (�ޤJ DragControls �����c��)

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, DragControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// �Ыؤ@�ӷs����������Ӻ޲z�즲�M���z
function DraggablePhysicsGroup() {
    const { itemsInScene } = useStore();
    const { camera, gl } = useThree(); // ���o camera �M��V�� DOM ����
    const orbitControlsRef = useRef();

    const [dragging, setDragging] = useState(false);

    // �N RigidBody �� ref �s�_��
    const rigidBodyRefs = useRef({});

    // �ϥ� useMemo �ӽT�O�u���b itemsInScene �ܤƮɤ~���s�p��
    const objectsToDrag = useMemo(() => {
        return Object.values(rigidBodyRefs.current).filter(ref => ref);
    }, [itemsInScene]);

    const rotateItem = (e) => {
        e.stopPropagation();
        // �z�L raycaster ���Q�k���I��������
        const clickedObject = e.object;
        if (clickedObject && clickedObject.userData.rigidBodyRef) {
            const body = clickedObject.userData.rigidBodyRef.current;
            body.wakeUp();
            const currentRotation = new THREE.Quaternion().copy(body.rotation());
            const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            currentRotation.multiply(rotationY);
            body.setRotation(currentRotation, true);
        }
    };

    return (
        <>
            <OrbitControls ref={orbitControlsRef} makeDefault enabled={!dragging} />
            <DragControls
                objects={objectsToDrag}
                // �N�ƥ��ť�j�w���V���� DOM �����W
                domElement={gl.domElement}
                // �즲�}�l��
                onDragStart={(e) => {
                    e.object.userData.rigidBodyRef.current.setBodyType(1); // Kinematic
                    setDragging(true);
                }}
                // �즲������
                onDragEnd={(e) => {
                    e.object.userData.rigidBodyRef.current.setBodyType(0); // Dynamic
                    setDragging(false);
                }}
            >
                <Physics gravity={[0, -9.8, 0]}>
                    <StorageSpace />
                    {itemsInScene.map((item) => (
                        <RigidBody
                            key={item.instanceId}
                            ref={(ref) => (rigidBodyRefs.current[item.instanceId] = ref)}
                            colliders='cuboid'
                            position={item.position}
                            type="dynamic"
                            // �N RigidBody �� ref �s�� userData ���A��K DragControls �X��
                            userData={{ rigidBodyRef: { current: rigidBodyRefs.current[item.instanceId] } }}
                            onContextMenu={rotateItem}
                        >
                            {/* DraggableItem �{�b�u�O�@�ӯº骺��ܤ��� */}
                            <DraggableItem item={item} />
                        </RigidBody>
                    ))}
                </Physics>
            </DragControls>
        </>
    );
}


export default function Scene() {
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
            <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />

            <DraggablePhysicsGroup />
        </Canvas>
    );
}