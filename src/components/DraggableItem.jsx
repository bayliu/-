// /src/components/DraggableItem.jsx (�̲ץ��T�� - ����ƥ��ť)

import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// �إߤ@�Ӥ��|�b re-render �ɭ��s�Ыت������A�į��n
const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    // �z�L useThree ���o canvas �����M��v��
    const { camera, gl } = useThree();

    const { w, h, d } = item.dimensions;

    const onPointerDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);

        // �إߤ@�Ӥ����즲�����A�䰪�צb��ƹ��I���쪺 3D ��m�� y �y��
        dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point);

        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }
        body.current.wakeUp();
        body.current.setBodyType(1); // Kinematic
    };

    // �ϥ� useCallback �]�ˡA�T�O�禡�ޥΤ��ܡA�H�K���T�a�����ƥ��ť
    const onPointerMove = useCallback((e) => {
        if (isDragging) {
            // �q��v���o�g�@���g�u
            const ray = new THREE.Ray();
            // �p��ƹ��b�зǤƳ]�Ʈy�Ф�����m (-1 to +1)
            const mouse = {
                x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
                y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
            };
            // ��s�g�u
            ray.setFromCamera(mouse, camera);

            // �p��g�u�P�즲���������I
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
    }, [isDragging]); // �̿� isDragging �T�O�ள��̷s�����A

    // �ϥ� useEffect �ӰʺA�j�w�M�M������ƥ��ť��
    useEffect(() => {
        if (isDragging) {
            gl.domElement.addEventListener('pointermove', onPointerMove);
            gl.domElement.addEventListener('pointerup', onPointerUp);
        }

        // �M���禡�G�� isDragging �ܬ� false �Τ�������ɰ���
        return () => {
            gl.domElement.removeEventListener('pointermove', onPointerMove);
            gl.domElement.removeEventListener('pointerup', onPointerUp);
        };
    }, [isDragging, gl.domElement, onPointerMove, onPointerUp]);


    const rotateItem = (e) => {
        e.stopPropagation();
        if (isDragging) return; // �즲�ɤ�����
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