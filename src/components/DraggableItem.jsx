import { useRef, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item }) {
  const body = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const { w, h, d } = item.dimensions;

  const onDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    body.current.setBodyType(1);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };
  
  const onDrag = (e) => {
    if (!isDragging || !e.ray) return;
    e.stopPropagation();
    const currentPos = body.current.translation();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -currentPos.y);
    const newPos = new THREE.Vector3();
    if(e.ray.intersectPlane(dragPlane, newPos)) {
      body.current.setNextKinematicTranslation(newPos);
    }
  };
  
  const onDragEnd = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    body.current.setBodyType(0);
  };

  const rotateItem = (e) => {
    e.stopPropagation();
    if (isDragging) return;
    const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
    const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    currentRotation.multiply(rotationY);
    body.current.setRotation(currentRotation, true);
  };

  return (
    <RigidBody 
      ref={body} 
      colliders={false} 
      position={item.position} 
      type="dynamic"
    >
      <CuboidCollider args={[w / 2, h / 2, d / 2]} />
      <group
        onPointerDown={onDragStart}
        onPointerMove={onDrag}
        onPointerUp={onDragEnd}
        onPointerOut={onDragEnd}
        onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
      >
        <Box args={[w, h, d]} castShadow receiveShadow>
          <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
        </Box>
        <Text
            color="white"
            fontSize={Math.min(w,d) * 0.3}
            position={[0, h / 2 + 0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={w}
        >
            {item.name}
        </Text>
      </group>
    </RigidBody>
  );
}