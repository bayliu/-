// /src/components/DraggableItem.jsx (最終正確版 - 全域事件監聽)

import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// 建立一個不會在 re-render 時重新創建的平面，效能更好
const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    // 透過 useThree 取得 canvas 元素和攝影機
    const { camera, gl } = useThree();

    const { w, h, d } = item.dimensions;

    const onPointerDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);

        // 建立一個水平拖曳平面，其高度在於滑鼠點擊到的 3D 位置的 y 座標
        dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point);

        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        body.current.wakeUp();
        body.current.setBodyType(1); // Kinematic
    };

    // 使用 useCallback 包裝，確保函式引用不變，以便正確地移除事件監聽
    const onPointerMove = useCallback((e) => {
        if (isDragging) {
            // 從攝影機發射一條射線
            const ray = new THREE.Ray();
            // 計算滑鼠在標準化設備座標中的位置 (-1 to +1)
            const mouse = {
                x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
                y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
            };
            // 更新射線
            ray.setFromCamera(mouse, camera);

            // 計算射線與拖曳平面的交點
            if (ray.intersectPlane(dragPlane, intersection)) {
                body.current.setNextKinematicTranslation(intersection);
            }
        }
    }, [isDragging, camera, gl.domElement.clientWidth, gl.domElement.clientHeight]);

    const onPointerUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = true;
            }
            body.current.setBodyType(0); // Dynamic
        }
    }, [isDragging]); // 依賴 isDragging 確保能拿到最新的狀態

    // 使用 useEffect 來動態綁定和清除全域事件監聽器
    useEffect(() => {
        if (isDragging) {
            gl.domElement.addEventListener('pointermove', onPointerMove);
            gl.domElement.addEventListener('pointerup', onPointerUp);
        }

        // 清除函式：當 isDragging 變為 false 或元件卸載時執行
        return () => {
            gl.domElement.removeEventListener('pointermove', onPointerMove);
            gl.domElement.removeEventListener('pointerup', onPointerUp);
        };
    }, [isDragging, gl.domElement, onPointerMove, onPointerUp]);


    const rotateItem = (e) => {
        e.stopPropagation();
        if (isDragging) return; // 拖曳時不旋轉
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