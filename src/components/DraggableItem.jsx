// /src/components/DraggableItem.jsx (�̲����Ҫ� v3 - �ץ��ƥ�j�w)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    // �Τ@�� state ���x�s�즲�����A�T�O���b re-render �����O������
    const [dragPlane, setDragPlane] = useState(new THREE.Plane());

    const { raycaster } = useThree();

    const onPointerDown = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        body.current.wakeUp();
        body.current.setBodyType(1); // Kinematic
        // �b�I���ɡA�ھڪ��骺���׳]�w�즲����
        setDragPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -e.point.y));
        setIsDragging(true);
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
        }
        if (isDragging) {
            body.current.setBodyType(0); // Dynamic
            setIsDragging(false);
        }
    };

    // �N�즲�޿��J useFrame�A�T�O�y�Z
    useFrame(() => {
        if (isDragging && body.current) {
            const intersection = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
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
            {/* �N�ƥ�j�w��o�� Box �W�A�o�O�Τ����I�������� */}
            <Box
                args={[w, h, d]}
                castShadow
                receiveShadow
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp} // ��ƹ����X�]����즲
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
            >
                <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
            </Box>
            <Text
                color="white"
                fontSize={Math.min(w, d, h) * 0.5} // �y�L�W�j�r��
                position={[0, h / 2 + 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                anchorX="center"
                anchorY="middle"
                maxWidth={w * 0.9}
                // �T�O��r���|�d�I�ƹ��ƥ�
                pointerEvents="none"
            >
                {item.name}
            </Text>
        </RigidBody>
    );
}