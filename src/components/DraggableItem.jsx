// /src/components/DraggableItem.jsx (最終修正版 - 直接綁定事件到 RigidBody)

import { useRef, useState, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);

    const { w, h, d } = item.dimensions;

    // --- 事件處理函數 (保持不變) ---

    const onDragStart = (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        body.current.wakeUp(); // 強制喚醒物體
        setIsDragging(true);
    };

    const onDrag = (e) => {
        if (!isDragging) return;
        e.stopPropagation();

        // 保持物體在拖曳時的高度不變
        const currentPos = body.current.translation();
        body.current.setNextKinematicTranslation({ x: e.point.x, y: currentPos.y, z: e.point.z });
    };

    const onDragEnd = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
        }
        if (isDragging) {
            setIsDragging(false);
        }
    };

    const rotateItem = (e) => {
        e.stopPropagation();
        if (isDragging) return;
        body.current.wakeUp(); // 旋轉前也喚醒
        const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
        const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        currentRotation.multiply(rotationY);
        body.current.setRotation(currentRotation, true);
    };

    // --- 狀態同步 Effect (保持不變) ---
    useEffect(() => {
        if (!body.current) return;
        if (isDragging) {
            body.current.setBodyType(1); // Kinematic
        } else {
            body.current.setBodyType(0); // Dynamic
        }
    }, [isDragging]);


    // --- JSX 渲染結構 (核心修改) ---

    return (
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
            // VVVVVV 將所有事件監聽器直接綁定到 RigidBody VVVVVV
            onPointerDown={onDragStart}
            onPointerMove={onDrag}
            onPointerUp={onDragEnd}
            onPointerOut={onDragEnd} // 當滑鼠移出物體時也結束拖曳
            onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        >
            {/* 移除 <group> 包裝，直接放置 3D 物件 */}
            <Box args={[w, h, d]} castShadow receiveShadow>
                <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
            </Box>
            <Text
                color="white"
                fontSize={Math.min(w, d, h) * 0.4}
                position={[0, h / 2 + 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                anchorX="center"
                anchorY="middle"
                maxWidth={w * 0.9}
                // 增加這個屬性，確保文字不會阻擋滑鼠事件
                pointerEvents="none"
            >
                {item.name}
            </Text>
        </RigidBody>
    );
}