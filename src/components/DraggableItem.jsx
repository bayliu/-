// /src/components/DraggableItem.jsx (最終拖曳優化版)

import { useRef, useState, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
  const body = useRef();
  const [isDragging, setIsDragging] = useState(false);

  // 確保在 isDragging 狀態改變後執行操作
  useEffect(() => {
    if (!body.current) return;
    
    if (isDragging) {
      body.current.setBodyType(1); // Kinematic
      body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      body.current.setBodyType(0); // Dynamic
    }
  }, [isDragging]);

  const onDragStart = (e) => {
    e.stopPropagation();
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
    // 強制喚醒物體
    body.current.wakeUp();
    setIsDragging(true);
  };
  
  const onDrag = (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const currentPos = body.current.translation();
    body.current.setNextKinematicTranslation({ x: e.point.x, y: currentPos.y, z: e.point.z });
  };
  
  const onDragEnd = (e) => {
    e.stopPropagation();
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const rotateItem = (e) => {
    e.stopPropagation();
    if (isDragging) return;
    body.current.wakeUp(); // 旋轉前也喚醒
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
            fontSize={Math.min(w,d,h) * 0.4}
            position={[0, h / 2 + 0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={w * 0.9}
        >
            {item.name}
        </Text>
      </group>
    </RigidBody>
  );
}