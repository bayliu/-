// /src/components/DraggableItem.jsx (�ץ� useDrag �ޥΨӷ�)

import { useRef, useState, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei'; // �O������
import { useDrag } from '@use-gesture/react'; // <-- �q���T���禡�w�ޤJ
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const { size, camera } = useThree();

    const { w, h, d } = item.dimensions;

    // �ϥ� useDrag Hook
    const bind = useDrag(
        ({ active, movement: [mx, my], event }) => {
            if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = !active;
            }
            setIsDragging(active);

            if (active) {
                const currentPos = body.current.translation();
                // �N�ù������ഫ�� 3D �@�ɮy��
                const vec = new THREE.Vector3();
                vec.set(
                    (event.clientX / size.width) * 2 - 1,
                    - (event.clientY / size.height) * 2 + 1,
                    0.5);
                vec.unproject(camera);
                vec.sub(camera.position).normalize();
                const distance = - camera.position.y / vec.y;
                const pos = camera.position.clone().add(vec.multiplyScalar(distance));

                body.current.setNextKinematicTranslation({ x: pos.x, y: currentPos.y, z: pos.z });
            }

            return event.timeStamp;
        },
        {
            // �]�m�즲���H��
            drag: { threshold: 3 },
            // �j�w�� window�A����ƹ����X����ɨƥ��_
            target: window,
        }
    );

    useEffect(() => {
        if (!body.current) return;
        if (isDragging) {
            body.current.setBodyType(1); // Kinematic
        } else {
            body.current.setBodyType(0); // Dynamic
        }
    }, [isDragging]);

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