// /src/components/DraggableItem.jsx (最終驗證版 v3 - 修正事件綁定)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    // 用一個 state 來儲存拖曳平面，確保它在 re-render 之間保持不變
    const [dragPlane, setDragPlane] = useState(new THREE.Plane());

    const { raycaster } = useThree();

    const onPointerDown = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        body.current.wakeUp();
        body.current.setBodyType(1); // Kinematic
        // 在點擊時，根據物體的高度設定拖曳平面
        setDragPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -e.point.y));
        setIsDragging(true);
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
        }
        if (isDragging) {
            body.current.setBodyType(0); // Dynamic
            setIsDragging(false);
        }
    };

    // 將拖曳邏輯放入 useFrame，確保流暢
    useFrame(() => {
        if (isDragging && body.current) {
            const intersection = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
                body.current.setNextKinematicTranslation(intersection);
            }
        }
    });

    const rotateItem = (e) => {
        e.stopPropagation();
        if (isDragging) return;
        body.current.wakeUp();
        const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
        const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        currentRotation.multiply(rotationY);
        body.current.setRotation(currentRotation, true);
    };

    const { w, h, d } = item.dimensions;

    return (
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
        >
            {/* 將事件綁定到這個 Box 上，這是用戶實際點擊的物體 */}
            <Box
                args={[w, h, d]}
                castShadow
                receiveShadow
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp} // 當滑鼠移出也停止拖曳
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
            >
                <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
            </Box>
            <Text
                color="white"
                fontSize={Math.min(w, d, h) * 0.5} // 稍微增大字體
                position={[0, h / 2 + 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                anchorX="center"
                anchorY="middle"
                maxWidth={w * 0.9}
                // 確保文字不會攔截滑鼠事件
                pointerEvents="none"
            >
                {item.name}
            </Text>
        </RigidBody>
    );
}