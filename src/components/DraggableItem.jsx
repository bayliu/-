// /src/components/DraggableItem.jsx (�̲ץ��Ʃ즲��)

import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// �N�o���ܼƲ���ե�~���A�קK�b�C����V�ɭ��s�Ы�
const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    // �z�L useThree ���o canvas �����M��v��
    const { camera, gl } = useThree();

    // �ϥ� ref ���x�s�����q�A�קKĲ�o�����n�� re-render
    const dragOffset = useRef(new THREE.Vector3());

    const onPointerDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);

        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }

        // 1. �p���I���I�M���餤�ߪ������q
        const currentPos = body.current.translation();
        dragOffset.current.copy(currentPos).sub(e.point);

        // 2. �إߩ즲�����A�䰪�צb��ƹ��I���쪺 3D ��m
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
                // 3. �p��s��m�G�N�������I�[�W���e�x�s�������q
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

    // �ϥ� useEffect �ӰʺA�j�w�M�M������ƥ��ť��
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
                onPointerDown={onPointerDown} // �u�O�d onPointerDown
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