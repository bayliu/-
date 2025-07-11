// /src/components/DraggableItem.jsx (最終驗證版 - useDrag)

import { useRef, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const { viewport } = useThree();

    useEffect(() => {
        // 禁用瀏覽器的右鍵選單
        const preventDefault = (e) => e.preventDefault();
        document.addEventListener('contextmenu', preventDefault);
        return () => document.removeEventListener('contextmenu', preventDefault);
    }, []);

    const bind = useDrag(
        ({ active, movement: [mx, my], event, first, last }) => {
            if (first) {
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
                body.current.setBodyType(1); // Kinematic
            }

            const currentPos = body.current.translation();
            // 將螢幕的像素移動轉換為 3D 世界中的單位移動
            const factor = viewport.factor;
            const newPos = {
                x: currentPos.x + mx / factor,
                y: currentPos.y, // 保持高度不變
                z: currentPos.z - my / factor // Y 軸在螢幕和 3D 中是相反的
            };
            body.current.setNextKinematicTranslation(newPos);

            if (last) {
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
                body.current.setBodyType(0); // Dynamic
            }
            return event;
        },
        {
            // 設置拖曳的閾值，防止輕微點擊被誤判為拖曳
            drag: { threshold: 3 },
        }
    );

    const rotateItem = (e) => {
        e.stopPropagation();
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
                {...bind()} // 將 useDrag 的事件處理器綁定到這個 Box 上
                args={[w, h, d]}
                castShadow
                receiveShadow
                onContextMenu={rotateItem}
            >
                <meshStandardMaterial color={'#f97316'} />
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