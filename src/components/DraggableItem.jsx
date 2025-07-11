// /src/components/DraggableItem.jsx (最終堆疊修正版)

import { useRef, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const { scene, camera } = useThree(); // 取得場景和攝影機

    const { w, h, d } = item.dimensions;

    // 使用 useDrag Hook
    const bind = useDrag(
        ({ active, first, last }) => {
            if (first) { // 拖曳開始
                setIsDragging(true);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
                body.current.setBodyType(1); // Kinematic
            }
            if (last) { // 拖曳結束
                setIsDragging(false);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
                body.current.setBodyType(0); // Dynamic
            }
        },
        { drag: { threshold: 3 } }
    );

    // 在每一幀中處理拖曳邏輯
    useFrame((state) => {
        if (isDragging) {
            // 創建一條從攝影機發出的射線
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(state.mouse, camera);

            // VVVVVVVV 核心修改：偵測所有可堆疊的物體 VVVVVVVV
            const intersects = raycaster.intersectObjects(scene.children, true);
            // 過濾掉被拖曳物體自身，只尋找其他物體或地面
            const firstIntersect = intersects.find(
                (i) => i.object.uuid !== body.current.uuid && i.object.parent.userData?.isStackable
            );

            if (firstIntersect) {
                // 如果找到了可以堆疊的表面，就將物體移動到那個點上
                const point = firstIntersect.point;
                // 為了避免物體陷入其他物體，我們在 Y 軸上增加一點點偏移
                body.current.setNextKinematicTranslation({ x: point.x, y: point.y + h / 2 + 0.01, z: point.z });
            }
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            body.current.wakeUp();
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

    return (
        // 我們在 RigidBody 的 userData 中加入一個標記，告訴射線這是一個可堆疊的物體
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
            userData={{ isStackable: true }}
        >
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