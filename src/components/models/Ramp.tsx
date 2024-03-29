/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty-pattern */

import { useTrimesh } from "@react-three/cannon";
import { ObjectMap, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export function Ramp() {
  const result: ObjectMap | any = useLoader(GLTFLoader, "/ramp.glb");

  const geometry = result.scene.children[0].geometry;

  const vertices = geometry.attributes.position.array;
  const indices = geometry.index.array;

  const [] = useTrimesh(
    () => ({
      args: [vertices, indices],
      mass: 10,
      type: "Static",
    }),
    useRef(null)
  );

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial attach="material" color={"black"} />
      </mesh>
    </group>
  );
}
