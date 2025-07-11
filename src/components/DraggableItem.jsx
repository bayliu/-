// /src/components/DraggableItem.jsx (�̲׭ץ��� - �����j�w�ƥ�� RigidBody)

import { useRef, useState, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);

    const { w, h, d } = item.dimensions;

    // --- �ƥ�B�z��� (�O������) ---

    const onDragStart = (e) => {
        e.stopPropagation(); // ����ƥ�_�w
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        body.current.wakeUp(); // �j��������
        setIsDragging(true);
    };

    const onDrag = (e) => {
        if (!isDragging) return;
        e.stopPropagation();

        // �O������b�즲�ɪ����פ���
        const currentPos = body.current.translation();
        body.current.setNextKinematicTranslation({ x: e.point.x, y: currentPos.y, z: e.point.z });
    };

    const onDragEnd = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
        }
        if (isDragging) {
            setIsDragging(false);
        }
    };

    const rotateItem = (e) => {
        e.stopPropagation();
        if (isDragging) return;
        body.current.wakeUp(); // ����e�]���
        const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
        const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        currentRotation.multiply(rotationY);
        body.current.setRotation(currentRotation, true);
    };

    // --- ���A�P�B Effect (�O������) ---
    useEffect(() => {
        if (!body.current) return;
        if (isDragging) {
            body.current.setBodyType(1); // Kinematic
        } else {
            body.current.setBodyType(0); // Dynamic
        }
    }, [isDragging]);


    // --- JSX ��V���c (�֤߭ק�) ---

    return (
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
            // VVVVVV �N�Ҧ��ƥ��ť�������j�w�� RigidBody VVVVVV
            onPointerDown={onDragStart}
            onPointerMove={onDrag}
            onPointerUp={onDragEnd}
            onPointerOut={onDragEnd} // ��ƹ����X����ɤ]�����즲
            onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        >
            {/* ���� <group> �]�ˡA������m 3D ���� */}
            <Box args={[w, h, d]} castShadow receiveShadow>
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
                // �W�[�o���ݩʡA�T�O��r���|���׷ƹ��ƥ�
                pointerEvents="none"
            >
                {item.name}
            </Text>
        </RigidBody>
    );
}