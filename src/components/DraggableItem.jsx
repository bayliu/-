// /src/components/DraggableItem.jsx (最終堆疊修正版)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const boxRef = useRef(); // 需要一個對視覺物件 Box 的引用
    const [isDragging, setIsDragging] = useState(false);
    const { scene, camera } = useThree();

    const { w, h, d } = item.dimensions;

    // 在每一幀中處理拖曳邏輯
    useFrame((state) => {
        if (isDragging && body.current && boxRef.current) {
            // 1. 創建從攝影機發出的射線
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(state.mouse, camera);

            // 2. 獲取場景中所有可交互的物體
            const intersects = raycaster.intersectObjects(scene.children, true);

            // 3. 過濾掉被拖曳的物體本身，找到第一個碰撞點
            const firstIntersect = intersects.find(
                (i) => i.object.uuid !== boxRef.current.uuid && i.object.userData.isStackable
            );

            if (firstIntersect) {
                // 4. 將物體移動到碰撞點上方
                const point = firstIntersect.point;
                // 在 Y 軸上加上被拖曳物體一半的高度，讓它底部貼著表面
                body.current.setNextKinematicTranslation({ x: point.x, y: point.y + h / 2, z: point.z });
            }
            body.current.wakeUp();
        }
    });

    const onPointerDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
        body.current.setBodyType(1); // Kinematic
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (isDragging) {
            setIsDragging(false);
            if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
            body.current.setBodyType(0); // Dynamic
        }
    };

    const rotateItem = (e) => {
        e.stopPropagation();
        if (isDragging) return;
        body.current.wakeUp();
        const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
        const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        currentRotation.multiply(rotationY);
        body.current.setRotation(currentRotation, true);
    };

    return (
        // 我們在 RigidBody 的 userData 中加入一個標記，告訴射線可以忽略它
        // 這樣可以避免物體自己擋住自己的射線
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
        >
            <Box
                ref={boxRef} // 將 ref 綁定到 Box Mesh
                args={[w, h, d]}
                castShadow
                receiveShadow
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp} // 當滑鼠移出也停止拖曳
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
                // 在視覺物件的 userData 中也加入標記，方便射線偵測
                userData={{ isStackable: true }}
            >
                <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
            </Box>
            <Text
                color="white"
                fontSize={Math.min(w, d, h) * 0.5}
                position={[0, h / 2 + 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                anchorX="center"
                anchorY="middle"
                maxWidth={w * 0.9}
                pointerEvents="none"
            >
                {item.name}
            </Text>
        </RigidBody>
    );
}