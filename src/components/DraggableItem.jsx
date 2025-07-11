// /src/components/DraggableItem.jsx (³Ì²×ª©)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef, setActiveItem, setDragPlane }) {
    const body = useRef();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const { w, h, d } = item.dimensions;

    const onPointerDown = (e) => {
        e.stopPropagation();
        setIsActive(true);
        setActiveItem({ ref: body });
        setDragPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -e.point.y));
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
        body.current.wakeUp();
        body.current.setBodyType(1);
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (isActive) {
            setIsActive(false);
            setActiveItem(null);
            if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
            body.current.setBodyType(0);
        }
    };

    const rotateItem = (e) => {
        e.stopPropagation();
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
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp}
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
            >
                <meshStandardMaterial color={isActive ? '#60a5fa' : (isHovered ? '#f9a826' : '#f97316')} />
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