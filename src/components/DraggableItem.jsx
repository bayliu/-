// /src/components/DraggableItem.jsx (最終平滑拖曳版)

import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// 將這些變數移到組件外部，避免在每次渲染時重新創建
const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    // 透過 useThree 取得 canvas 元素和攝影機
    const { camera, gl } = useThree();

    // 使用 ref 來儲存偏移量，避免觸發不必要的 re-render
    const dragOffset = useRef(new THREE.Vector3());

    const onPointerDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);

        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }

        // 1. 計算點擊點和物體中心的偏移量
        const currentPos = body.current.translation();
        dragOffset.current.copy(currentPos).sub(e.point);

        // 2. 建立拖曳平面，其高度在於滑鼠點擊到的 3D 位置
        dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point);

        body.current.wakeUp();
        body.current.setBodyType(1); // Kinematic
    };

    const onPointerMove = useCallback((e) => {
        if (isDragging) {
            const ray = new THREE.Ray();
            const mouse = {
                x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
                y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
            };
            ray.setFromCamera(mouse, camera);

            if (ray.intersectPlane(dragPlane, intersection)) {
                // 3. 計算新位置：將平面交點加上之前儲存的偏移量
                const newPosition = new THREE.Vector3().copy(intersection).add(dragOffset.current);
                body.current.setNextKinematicTranslation(newPosition);
            }
        }
    }, [isDragging, camera, gl.domElement]);

    const onPointerUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = true;
            }
            body.current.setBodyType(0); // Dynamic
        }
    }, [isDragging]);

    // 使用 useEffect 來動態綁定和清除全域事件監聽器
    useEffect(() => {
        if (isDragging) {
            gl.domElement.addEventListener('pointermove', onPointerMove);
            gl.domElement.addEventListener('pointerup', onPointerUp);
        }
        return () => {
            gl.domElement.removeEventListener('pointermove', onPointerMove);
            gl.domElement.removeEventListener('pointerup', onPointerUp);
        };
    }, [isDragging, gl.domElement, onPointerMove, onPointerUp]);

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
                onPointerDown={onPointerDown} // 只保留 onPointerDown
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