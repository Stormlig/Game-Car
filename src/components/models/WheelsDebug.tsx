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
          <cylinderGeometry args={[radius, radius, 0.018, 25]} />
          <meshNormalMaterial opacity={0.15} />
        </mesh>
      </group>
    )
  );
};
