// /src/components/DraggableItem.jsx (最終驗證版 v4 - 使用 useDrag)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text, useDrag } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const { size } = useThree();

    const { w, h, d } = item.dimensions;

    // 使用 useDrag Hook
    const bind = useDrag(
        ({ active, movement: [mx, my], timeStamp, event }) => {
            // 拖曳開始
            if (active && !isDragging) {
                setIsDragging(true);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
                body.current.setBodyType(1); // Kinematic
                body.current.wakeUp();
            }
            // 拖曳結束
            if (!active && isDragging) {
                setIsDragging(false);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
                body.current.setBodyType(0); // Dynamic
            }

            // 拖曳中
            if (isDragging) {
                const currentPos = body.current.translation();
                // 將螢幕上的移動轉換為 3D 世界中的移動
                // 這個計算比較複雜，但 useDrag 幫我們簡化了
                const newX = currentPos.x + (mx / size.width) * 10;
                const newZ = currentPos.z - (my / size.height) * 10;

                // 我們只在 XZ 平面上移動，Y 保持不變
                body.current.setNextKinematicTranslation({ x: newX, y: currentPos.y, z: newZ });
            }

            return timeStamp; // 必須返回 timeStamp
        },
        {
            // 設置拖曳的閾值，防止輕微點擊被誤判為拖曳
            drag: { threshold: 3 },
        }
    );

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
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
        >
            {/* 將 useDrag 返回的事件綁定到這個 Box 上 */}
            <Box
                {...bind()}
                args={[w, h, d]}
                castShadow
                receiveShadow
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
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