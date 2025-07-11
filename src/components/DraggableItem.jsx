// /src/components/DraggableItem.jsx (最終驗證版)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPoint, setDragStartPoint] = useState(new THREE.Vector3());
    const { camera, raycaster } = useThree();

    const onPointerDown = (e) => {
        e.stopPropagation();
        // 禁用視角控制器
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        // 喚醒物理體
        body.current.wakeUp();
        // 設置為 Kinematic，讓我們可以手動控制它
        body.current.setBodyType(1);
        // 記錄拖曳平面的高度
        setDragStartPoint(new THREE.Vector3(0, e.point.y, 0));
        setIsDragging(true);
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        // 重新啟用視角控制器
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
        }
        if (isDragging) {
            // 將控制權交還給物理引擎
            body.current.setBodyType(0);
            setIsDragging(false);
        }
    };

    // 在每一幀中更新位置
    useFrame(() => {
        if (isDragging && body.current) {
            // 創建一個與相機視角平行的拖曳平面
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -dragStartPoint.y);
            const intersection = new THREE.Vector3();
            // 計算滑鼠射線與平面的交點
            if (raycaster.ray.intersectPlane(plane, intersection)) {
                // 更新物理體的位置
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
                fontSize={Math.min(w, d, h) * 0.4}
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