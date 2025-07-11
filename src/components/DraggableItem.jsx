// /src/components/DraggableItem.jsx (最終驗證版 - useDrag)

import { useRef, useEffect, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const { size, camera } = useThree();

    const { w, h, d } = item.dimensions;

    // 使用 useDrag Hook
    const bind = useDrag(
        ({ active, movement: [mx, my], timeStamp, event, first, last }) => {
            if (first) { // 拖曳開始
                setIsDragging(true);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
                body.current.setBodyType(1); // 設置為 Kinematic，手動控制
                body.current.wakeUp();
            }

            if (active) { // 拖曳中
                const currentPos = body.current.translation();

                // 使用一個固定的平面來計算拖曳位置，避免跳動
                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -currentPos.y);
                const ray = new THREE.Ray();
                const mouse = new THREE.Vector2(
                    (event.clientX / size.width) * 2 - 1,
                    - (event.clientY / size.height) * 2 + 1
                );
                ray.setFromCamera(mouse, camera);

                const intersection = new THREE.Vector3();
                if (ray.intersectPlane(plane, intersection)) {
                    body.current.setNextKinematicTranslation(intersection);
                }
            }

            if (last) { // 拖曳結束
                setIsDragging(false);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
                body.current.setBodyType(0); // 恢復為 Dynamic，交給物理引擎
            }
            return timeStamp;
        },
        { drag: { threshold: 3 } }
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