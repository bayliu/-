// /src/components/DraggableItem.jsx (����ץ���)

import { useRef, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);

    const { w, h, d } = item.dimensions;

    const onDragStart = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        setIsDragging(true);
        body.current.setBodyType(1); // Kinematic
        body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    };

    const onDrag = (e) => {
        if (!isDragging || !e.ray.origin) return; // �W�[�O�@
        e.stopPropagation();

        // �ץ��즲�޿�G�����ϥΨƥ��I e.point
        const newPos = new THREE.Vector3().copy(e.point);
        const currentPos = body.current.translation();
        newPos.y = currentPos.y; // �O���즲�ɪ����פ���

        body.current.setNextKinematicTranslation(newPos);
    };

    const onDragEnd = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
        }
        if (isDragging) { // �u���b���b�즲�ɤ~����
            setIsDragging(false);
            body.current.setBodyType(0); // Dynamic
        }
    };

    const rotateItem = (e) => {
        e.stopPropagation();
        if (isDragging) return;
        const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
        const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        currentRotation.multiply(rotationY);
        body.current.setRotation(currentRotation, true);
    };

    return (
        <RigidBody
            ref={body}
            colliders='cuboid' // ²�Ƽg�k
            position={item.position}
            type="dynamic"
        >
            <group
                onPointerDown={onDragStart}
                onPointerMove={onDrag}
                onPointerUp={onDragEnd}
                onPointerOut={onDragEnd}
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
            >
                <Box args={[w, h, d]} castShadow receiveShadow>
                    <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
                </Box>
                <Text
                    color="white"
                    fontSize={Math.min(w, d) * 0.3}
                    position={[0, h / 2 + 0.1, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={w}
                >
                    {item.name}
                </Text>
            </group>
        </RigidBody>
    );
}