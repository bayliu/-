// /src/components/DraggableItem.jsx (使用 DragControls 的重構版)

import { useRef } from 'react';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// 注意：這個元件現在只負責顯示，不處理物理和拖曳邏輯
export default function DraggableItem({ item }) {
  const { w, h, d } = item.dimensions;

  return (
    <>
      <Box args={[w, h, d]} castShadow receiveShadow>
        <meshStandardMaterial color={'#f97316'} />
      </Box>
      <Text
          color="white"
          fontSize={Math.min(w, d, h) * 0.4}
          position={[0, h / 2 + 0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          anchorX="center"
          anchorY="middle"
          maxWidth={w * 0.9}
          pointerEvents="none"
      >
          {item.name}
      </Text>
    </>
  );
}