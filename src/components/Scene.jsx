// /src/components/Scene.jsx (�̲׭ץ��� v6 - Canvas �h�Ũƥ�޲z)components/Scene.jsx`**

** �ХΥH�U�i�̲ש즲�ץ����j������{���X�A�л\���z�쥻�� `/src/components/Scene.jsx` �ɮסG**

    ```javascript
// /

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Planesrc/components/Scene.jsx (�̲ש즲�ץ���)

import { Canvas, useFrame, useThree } from } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import Dr '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';aggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store
import { Physics } from '@react-three/rapier';
import DraggableItem from './DraggableItem';/useStore';
import { useRef, useState } from 'react';

function SceneContent() {
  const items
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRefInScene = useStore((state) => state.itemsInScene);
  const orbitControlsRef = useRef();, useState } from 'react';
import * as THREE from 'three';

function SceneContent() {
  const items
  
  const [activeItem, setActiveItem] = useState(null);

  const onPointerDown = (eInScene = useStore((state) => state.itemsInScene);
  const orbitControlsRef = useRef();
  
  // �o�� state �{�b�Ψӱ���u��ı�����v
  const [ghostItem, setGhost) => {
    // �u�����I���� RigidBody ���l���� (�]�N�O�ڭ̪� Box) �ɤ~Ĳ�o
    if (e.eventObject.parent?.userData?.isDraggable) {
      e.stopPropagationItem] = useState(null);
  const { raycaster } = useThree();

  useFrame(() => {();
      setActiveItem({
        ref: e.eventObject.parent.userData.bodyRef,
        
    // �p�G�����b�즲���u��ı�����v
    if (ghostItem) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -ghostIteminitialDistance: e.distance,
        dragPlane: new THREE.Plane(new THREE.Vector3(0,.planeY);
      const intersection = new THREE.Vector3();
      if (raycaster.ray.intersectPlane( 1, 0), -e.point.y),
      });
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    }
  };

  const onPointerUpplane, intersection)) {
        // ��s��ı��������m
        ghostItem.ref.current.position.copy = (e) => {
    if (activeItem) {
      e.stopPropagation();
      const body(intersection);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 10, 7]} 
        intensity={1.0} 
        castShadow 
        shadow-mapSize-width={2048 = activeItem.ref.current;
      if (body) body.setBodyType(0); // Dynamic
      setActiveItem(null);
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
    }
  };

  const onPointerMove = (e) => {
    if (activeItem) {
      e.stopPropagation();
      const body = activeItem.ref.current;
}
        shadow-mapSize-height={2048}
      />
      <OrbitControls ref={orbitControlsRef} makeDefault />
      <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />
      
      <Physics gravity={[0, -9.8, 0]}>
              const intersection = new THREE.Vector3();
      if (body && e.ray.intersectPlane(activeItem.dragPlane, intersection)) {
        body.setNextKinematicTranslation(intersection);
      }
    }
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <StorageSpace />
        {itemsInScene.map((item) => (
          <DraggableItem 
            key={item.instanceId} 
            item={item} 
            orbitControlsRef={orbitControlsRef}
            setGhostItem={setGhostItem}
          />
        ))}
      </Physics><directionalLight 
        position={[5, 10, 7]} 
        intensity={1.0} 
        castShadow 
      />
      <OrbitControls ref={orbitControlsRef} makeDefault />
      <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />
      
      {/* �b�o�̲Τ@��ť�ƥ� */}
      <group 
        onPointerDown={onPointer

      {/* �p�G�����b�즲�����~�A�N��V�����u��ı�����v */}
      {ghostItem && (
        <mesh ref={ghostItem.ref} position={ghostItem.position}>
          <boxGeometry args={[ghostItem.args.w, ghostItem.args.h, ghostItem.args.d]} />
          Down}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.7} />
        </mesh>onPointerLeave={onPointerUp} // �p�G�ƹ����X�e���]����즲
      >
        <
      )}
    </>
  );
}

export default function Scene() {
    return (
        Physics gravity={[0, -9.8, 0]}>
          <StorageSpace />
          {items<Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>InScene.map((item) => (
            <DraggableItem 
              key={item.instanceId
            <SceneContent />
        </Canvas>
    )
}