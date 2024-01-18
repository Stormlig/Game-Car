/* eslint-disable @typescript-eslint/no-explicit-any */
const debug = false;

export const WheelDebug = ({
  radius,
  wheelRef,
}: {
  radius: number;
  wheelRef: any;
}) => {
  return (
    debug && (
      <group ref={wheelRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius, radius, 0.015, 16]} />
          <meshNormalMaterial opacity={0.25} />
        </mesh>
      </group>
    )
  );
};
