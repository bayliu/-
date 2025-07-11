// /src/components/DraggableItem.jsx (�̲װ��|�ץ���)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const boxRef = useRef(); // �ݭn�@�ӹ��ı���� Box ���ޥ�
    const [isDragging, setIsDragging] = useState(false);
    const { scene, camera } = useThree();

    const { w, h, d } = item.dimensions;

    // �b�C�@�V���B�z�즲�޿�
    useFrame((state) => {
        if (isDragging && body.current && boxRef.current) {
            // 1. �Ыرq��v���o�X���g�u
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(state.mouse, camera);

            // 2. ����������Ҧ��i�椬������
            const intersects = raycaster.intersectObjects(scene.children, true);

            // 3. �L�o���Q�즲�����饻���A���Ĥ@�ӸI���I
            const firstIntersect = intersects.find(
                (i) => i.object.uuid !== boxRef.current.uuid && i.object.userData.isStackable
            );

            if (firstIntersect) {
                // 4. �N���鲾�ʨ�I���I�W��
                const point = firstIntersect.point;
                // �b Y �b�W�[�W�Q�즲����@�b�����סA���������K�۪�
                body.current.setNextKinematicTranslation({ x: point.x, y: point.y + h / 2, z: point.z });
            }
            body.current.wakeUp();
        }
    });

    const onPointerDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
        body.current.setBodyType(1); // Kinematic
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (isDragging) {
            setIsDragging(false);
            if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
            body.current.setBodyType(0); // Dynamic
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

    return (
        // �ڭ̦b RigidBody �� userData ���[�J�@�ӼаO�A�i�D�g�u�i�H������
        // �o�˥i�H�קK����ۤv�צ�ۤv���g�u
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
        >
            <Box
                ref={boxRef} // �N ref �j�w�� Box Mesh
                args={[w, h, d]}
                castShadow
                receiveShadow
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp} // ��ƹ����X�]����즲
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
                // �b��ı���� userData ���]�[�J�аO�A��K�g�u����
                userData={{ isStackable: true }}
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