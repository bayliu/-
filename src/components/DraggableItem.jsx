// /src/components/DraggableItem.jsx (�̲����Ҫ�)

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
        // �T�ε������
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        // ������z��
        body.current.wakeUp();
        // �]�m�� Kinematic�A���ڭ̥i�H��ʱ��
        body.current.setBodyType(1);
        // �O���즲����������
        setDragStartPoint(new THREE.Vector3(0, e.point.y, 0));
        setIsDragging(true);
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        // ���s�ҥε������
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
        }
        if (isDragging) {
            // �N�����v���ٵ����z����
            body.current.setBodyType(0);
            setIsDragging(false);
        }
    };

    // �b�C�@�V����s��m
    useFrame(() => {
        if (isDragging && body.current) {
            // �Ыؤ@�ӻP�۾��������檺�즲����
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -dragStartPoint.y);
            const intersection = new THREE.Vector3();
            // �p��ƹ��g�u�P���������I
            if (raycaster.ray.intersectPlane(plane, intersection)) {
                // ��s���z�骺��m
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
                onPointerOut={onPointerUp} // ��ƹ����X�]����즲
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