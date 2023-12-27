/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Effects } from "@react-three/drei";
import { extend, useLoader } from "@react-three/fiber";
import { LUTPass, LUTCubeLoader } from "three-stdlib";

extend({ LUTPass });

export const Grading = () => {
  const { texture3D } = useLoader(LUTCubeLoader, "/F-6800-STD.cube");

  return (
    <Effects>
      {/* @ts-expect-error  */}
      <lUTPass lut={texture3D} intensity={1} />
    </Effects>
  );
};
