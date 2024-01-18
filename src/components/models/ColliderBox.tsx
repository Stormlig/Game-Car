import { useBox } from "@react-three/cannon";

const debug = true;

export function ColliderBox({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  useBox(() => ({
    args: scale,
    position,
    type: "Static",
  }));

  return (
    debug && (
      <mesh position={position}>
        <boxGeometry args={scale} />
        <meshBasicMaterial transparent={true} opacity={0.25} />
      </mesh>
    )
  );
}
