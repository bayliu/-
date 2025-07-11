// /src/components/Scene.jsx (引入 DragControls 的重構版)

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, DragControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// 創建一個新的內部元件來管理拖曳和物理
function DraggablePhysicsGroup() {
    const { itemsInScene } = useStore();
    const { camera, gl } = useThree(); // 取得 camera 和渲染器 DOM 元素
    const orbitControlsRef = useRef();

    const [dragging, setDragging] = useState(false);

    // 將 RigidBody 的 ref 存起來
    const rigidBodyRefs = useRef({});

    // 使用 useMemo 來確保只有在 itemsInScene 變化時才重新計算
    const objectsToDrag = useMemo(() => {
        return Object.values(rigidBodyRefs.current).filter(ref => ref);
    }, [itemsInScene]);

    const rotateItem = (e) => {
        e.stopPropagation();
        // 透過 raycaster 找到被右鍵點擊的物體
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
                // 將事件監聽綁定到渲染器的 DOM 元素上
                domElement={gl.domElement}
                // 拖曳開始時
                onDragStart={(e) => {
                    e.object.userData.rigidBodyRef.current.setBodyType(1); // Kinematic
                    setDragging(true);
                }}
                // 拖曳結束時
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
                            // 將 RigidBody 的 ref 存到 userData 中，方便 DragControls 訪問
                            userData={{ rigidBodyRef: { current: rigidBodyRefs.current[item.instanceId] } }}
                            onContextMenu={rotateItem}
                        >
                            {/* DraggableItem 現在只是一個純粹的顯示元件 */}
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