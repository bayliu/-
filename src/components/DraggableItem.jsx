// /src/components/DraggableItem.jsx (�̲׭ץ��� v5.2 - �ץ���V�Y����~)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const boxRef = useRef(); // �s�W�@�ӹ� Box Mesh ���ޥ�
    const [isDragging, setIsDragging] = useState(false);
    const { scene, camera } = useThree();

    const { w, h, d } = item.dimensions;

    const bind = () => { }; // useDrag �b�W�����դ���í�w�A�Ȯɲ����H²���޿�

    useFrame((state) => {
        if (isDragging) {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(state.mouse, camera);

            // VVVVVVVV �֤߭ק� VVVVVVVV
            const intersects = raycaster.intersectObjects(scene.children, true);
            // �L�o���Q�즲����ۨ�(��Box Mesh)�A�u�M���L����Φa��
            const firstIntersect = intersects.find(
                (i) => i.object.uuid !== boxRef.current.uuid && i.object.parent.userData?.isStackable
            );
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            if (firstIntersect) {
                const point = firstIntersect.point;
                body.current.setNextKinematicTranslation({ x: point.x, y: point.y + h / 2 + 0.01, z: point.z });
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
        setIsDragging(false);
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
        body.current.setBodyType(0); // Dynamic
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
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
            userData={{ isStackable: true }}
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