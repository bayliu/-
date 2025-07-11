// /src/components/DraggableItem.jsx (最終驗證版 v5 - 穩定追蹤)

import { useRef, useState, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// 接收一個新的 prop `setDragging`，用來通知 Scene 元件
export default function DraggableItem({ item, orbitControlsRef, setDragging }) {
    const body = useRef();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const { w, h, d } = item.dimensions;

    const onPointerEnter = () => setIsHovered(true);
    const onPointerLeave = () => setIsHovered(false);

    const onPointerDown = (e) => {
        e.stopPropagation();
        // 設置自身為活動狀態，並通知 Scene
        setIsActive(true);
        setDragging(true);
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
        body.current.setBodyType(1); // Kinematic
        body.current.wakeUp();
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (isActive) {
            setIsActive(false);
            setDragging(false);
            if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
            body.current.setBodyType(0); // Dynamic
        }
    };

    const rotateItem = (e) => {
        e.stopPropagation();
        body.current.wakeUp();
        const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
        const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        currentRotation.multiply(rotationY);
        body.current.setRotation(currentRotation, true);
    };

    // 將拖曳邏輯轉移到 Scene 元件中集中處理
    // 這個元件現在只負責觸發狀態變化

    return (
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
        >
            <Box
                args={[w, h, d]}
                castShadow
                receiveShadow
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
            >
                <meshStandardMaterial color={isActive ? '#60a5fa' : (isHovered ? '#f9a826' : '#f97316')} />
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