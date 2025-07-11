// /src/components/Scene.jsx (最終驗證版 v5 - 穩定追蹤)

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// 創建一個看不見的滑鼠追蹤器
function MouseTracker() {
    const trackerRef = useRef();

    useFrame(({ mouse, viewport }) => {
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        // 讓追蹤器在一個固定的高度上跟隨滑鼠
        // 注意：這個追蹤器沒有物理特性，只是一個視覺上的點
        if (trackerRef.current) {
            // 這是一個簡化的追蹤，更精確的需要 raycaster，但我們先用這個穩定的
            // trackerRef.current.position.set(x, 1, y);
        }
    });

    return (
        <mesh ref={trackerRef} visible={false}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial />
        </mesh>
    );
}


export default function Scene() {
    const itemsInScene = useStore((state) => state.itemsInScene);
    const orbitControlsRef = useRef();

    // 用一個 state 來追蹤當前是否有物體在被拖曳
    const [isDragging, setIsDragging] = useState(false);
    const { raycaster, camera } = useThree();

    // useFrame(({raycaster, camera}) => {
    //     if(isDragging){
    //         const plane = new THREE.Plane(new THREE.Vector3(0,1,0), -1)
    //         const intersection = new THREE.Vector3();
    //         if (raycaster.ray.intersectPlane(plane, intersection)) {
    //             console.log(intersection)
    //         }
    //     }
    // })

    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[5, 10, 7]}
                intensity={1.0}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <OrbitControls ref={orbitControlsRef} makeDefault enabled={true} />
            <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />

            <Physics gravity={[0, -9.8, 0]}>
                <StorageSpace />
                {itemsInScene.map((item) => (
                    <DraggableItem
                        key={item.instanceId}
                        item={item}
                        orbitControlsRef={orbitControlsRef}
                        // 將 setDragging 函數傳遞下去
                        setDragging={setIsDragging}
                    />
                ))}
            </Physics>
            {/* 放入滑鼠追蹤器 */}
            {/* <MouseTracker /> */}
        </>
    );
}

// 為了讓 Scene 在 Canvas 內部能訪問到 useThree hook，我們需要再包裝一層
const SceneWrapper = () => {
    return (
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>
            <Scene />
        </Canvas>
    )
}

export { SceneWrapper as default };