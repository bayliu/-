// /src/components/DraggableItem.jsx (�̲�í�w��)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);

    // �Τ@�� state ���x�s�즲�����A�T�O���b�ƥ󤧶��O������
    const [dragPlane, setDragPlane] = useState(new THREE.Plane());

    const onPointerDown = (e) => {
        e.stopPropagation();
        // �]�m�즲�����b��e���骺����
        setDragPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -e.point.y));

        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        body.current.wakeUp();
        body.current.setBodyType(1); // Kinematic
        setIsDragging(true);
    };

    const onPointerMove = (e) => {
        if (isDragging) {
            e.stopPropagation();
            const intersection = new THREE.Vector3();
            // �b onPointerMove �ƥ󤤭p��P���������I
            if (e.ray.intersectPlane(dragPlane, intersection)) {
                body.current.setNextKinematicTranslation(intersection);
            }
        }
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (isDragging) {
            if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = true;
            }
            body.current.setBodyType(0); // Dynamic
            setIsDragging(false);
        }
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
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp} // ��ƹ����X�]����즲
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