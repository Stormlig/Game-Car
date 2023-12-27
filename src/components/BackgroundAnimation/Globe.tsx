/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sparkles, useTexture } from "@react-three/drei";

export const Globe = (props: any) => {
  const texture = useTexture("/thunder.jpg");
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        map={texture}
        clearcoat={0}
        clearcoatRoughness={5}
        roughness={0}
        metalness={0}
        emissive={0}
      />

      <Sparkles count={100} scale={1 * 2} size={3} speed={0.4} noise={3} />
    </mesh>
  );
};
