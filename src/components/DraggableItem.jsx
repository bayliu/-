// /src/components/DraggableItem.jsx (�̲����Ҫ� v4 - �ϥ� useDrag)

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

    // �ϥ� useDrag Hook
    const bind = useDrag(
        ({ active, movement: [mx, my], timeStamp, event }) => {
            // �즲�}�l
            if (active && !isDragging) {
                setIsDragging(true);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
                body.current.setBodyType(1); // Kinematic
                body.current.wakeUp();
            }
            // �즲����
            if (!active && isDragging) {
                setIsDragging(false);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
                body.current.setBodyType(0); // Dynamic
            }

            // �즲��
            if (isDragging) {
                const currentPos = body.current.translation();
                // �N�ù��W�������ഫ�� 3D �@�ɤ�������
                // �o�ӭp���������A�� useDrag ���ڭ�²�ƤF
                const newX = currentPos.x + (mx / size.width) * 10;
                const newZ = currentPos.z - (my / size.height) * 10;

                // �ڭ̥u�b XZ �����W���ʡAY �O������
                body.current.setNextKinematicTranslation({ x: newX, y: currentPos.y, z: newZ });
            }

            return timeStamp; // ������^ timeStamp
        },
        {
            // �]�m�즲���H�ȡA����L�I���Q�~�P���즲
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
            {/* �N useDrag ��^���ƥ�j�w��o�� Box �W */}
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