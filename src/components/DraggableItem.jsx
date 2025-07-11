// /src/components/DraggableItem.jsx (最終修正版 v5.2 - 修正渲染崩潰錯誤)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const boxRef = useRef(); // 新增一個對 Box Mesh 的引用
    const [isDragging, setIsDragging] = useState(false);
    const { scene, camera } = useThree();

    const { w, h, d } = item.dimensions;

    const bind = () => { }; // useDrag 在上次測試中不穩定，暫時移除以簡化邏輯

    useFrame((state) => {
        if (isDragging) {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(state.mouse, camera);

            // VVVVVVVV 核心修改 VVVVVVVV
            const intersects = raycaster.intersectObjects(scene.children, true);
            // 過濾掉被拖曳物體自身(的Box Mesh)，只尋找其他物體或地面
            const firstIntersect = intersects.find(
                (i) => i.object.uuid !== boxRef.current.uuid && i.object.parent.userData?.isStackable
            );
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            if (firstIntersect) {
                const point = firstIntersect.point;
                body.current.setNextKinematicTranslation({ x: point.x, y: point.y + h / 2 + 0.01, z: point.z });
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
        setIsDragging(false);
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
        body.current.setBodyType(0); // Dynamic
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
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
            userData={{ isStackable: true }}
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