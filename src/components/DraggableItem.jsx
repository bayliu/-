import { useRef, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) { // <--- �ק�o��
  const body = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const { w, h, d } = item.dimensions;

  const onDragStart = (e) => {
    e.stopPropagation();
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false; // <--- �s�W�o�@��
    }
    setIsDragging(true);
    body.current.setBodyType(1); // Kinematic
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
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true; // <--- �s�W�o�@��
    }
    setIsDragging(false);
    body.current.setBodyType(0); // Dynamic
  };

  const rotateItem = (e) => {
    // ... �����޿�O������
  };

  return (
    // ... return ���e�O������
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
        onPointerOut={onDragEnd} // <--- onPointerOut �]�nĲ�o onDragEnd
        onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
      >
        {/* ... */}
      </group>
    </RigidBody>
  );
}