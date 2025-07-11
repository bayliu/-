// /src/components/DraggableItem.jsx (�̲װ��|�ץ���)

import { useRef, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const { scene, camera } = useThree(); // ���o�����M��v��

    const { w, h, d } = item.dimensions;

    // �ϥ� useDrag Hook
    const bind = useDrag(
        ({ active, first, last }) => {
            if (first) { // �즲�}�l
                setIsDragging(true);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
                body.current.setBodyType(1); // Kinematic
            }
            if (last) { // �즲����
                setIsDragging(false);
                if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
                body.current.setBodyType(0); // Dynamic
            }
        },
        { drag: { threshold: 3 } }
    );

    // �b�C�@�V���B�z�즲�޿�
    useFrame((state) => {
        if (isDragging) {
            // �Ыؤ@���q��v���o�X���g�u
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(state.mouse, camera);

            // VVVVVVVV �֤߭ק�G�����Ҧ��i���|������ VVVVVVVV
            const intersects = raycaster.intersectObjects(scene.children, true);
            // �L�o���Q�즲����ۨ��A�u�M���L����Φa��
            const firstIntersect = intersects.find(
                (i) => i.object.uuid !== body.current.uuid && i.object.parent.userData?.isStackable
            );

            if (firstIntersect) {
                // �p�G���F�i�H���|�����A�N�N���鲾�ʨ쨺���I�W
                const point = firstIntersect.point;
                // ���F�קK���鳴�J��L����A�ڭ̦b Y �b�W�W�[�@�I�I����
                body.current.setNextKinematicTranslation({ x: point.x, y: point.y + h / 2 + 0.01, z: point.z });
            }
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            body.current.wakeUp();
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

    return (
        // �ڭ̦b RigidBody �� userData ���[�J�@�ӼаO�A�i�D�g�u�o�O�@�ӥi���|������
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
            userData={{ isStackable: true }}
        >
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