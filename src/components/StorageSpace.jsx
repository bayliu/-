import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Box, Edges } from '@react-three/drei';
import useStore from '../store/useStore';

export default function StorageSpace() {
  const { storageSpaces, selectedSpace } = useStore((state) => ({
    storageSpaces: state.storageSpaces,
    selectedSpace: state.selectedSpace,
  }));
  
  const dims = storageSpaces[selectedSpace];

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Visual Box */}
      <Box position={[0, dims.h / 2, 0]} args={[dims.w, dims.h, dims.d]}>
        <meshBasicMaterial transparent opacity={0} />
        <Edges color="white" lineWidth={2} />
      </Box>

      {/* Physics Colliders */}
      <CuboidCollider args={[dims.w / 2, 0.05, dims.d / 2]} position={[0, 0, 0]} />
      <CuboidCollider args={[0.05, dims.h / 2, dims.d / 2]} position={[-dims.w / 2, dims.h / 2, 0]} />
      <CuboidCollider args={[0.05, dims.h / 2, dims.d / 2]} position={[dims.w / 2, dims.h / 2, 0]} />
      <CuboidCollider args={[dims.w / 2, dims.h / 2, 0.05]} position={[0, dims.h / 2, -dims.d / 2]} />
      <CuboidCollider args={[dims.w / 2, dims.h / 2, 0.05]} position={[0, dims.h / 2, dims.d / 2]} />
    </RigidBody>
  );
}