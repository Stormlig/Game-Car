/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Effects,
  useTexture,
  Float,
  Stars,
  Trail,
} from "@react-three/drei";
import { LUTPass, LUTCubeLoader } from "three-stdlib";
import { useRef, useState, RefObject } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

extend({ LUTPass });

function Grading() {
  const { texture3D } = useLoader(LUTCubeLoader, "/F-6800-STD.cube");
  return (
    <Effects>
      {/* @ts-ignore  */}
      <lUTPass lut={texture3D} intensity={1} />
    </Effects>
  );
}

function Sphere(props: any) {
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
    </mesh>
  );
}

const Electron = () => {
  const ref: RefObject<THREE.Mesh> = useRef<THREE.Mesh>(null);
  const [initialPosition] = useState(() => {
    const angle = 1; // Random angle in radians
    const inclination = 1; // Random inclination between -π/2 and π/2
    const distance = 16; // Random distance between 5 and 10
    const x = Math.cos(angle) * Math.cos(inclination) * distance;
    const y = Math.sin(inclination) * distance;
    const z = Math.sin(angle) * Math.cos(inclination) * distance;
    return [x, y, z];
  });
  const [speed] = useState(() => Math.random() * 5 + 1); // Random speed between 1 and 6

  useFrame((state) => {
    const t = state.clock.oldTime * speed;
    if (ref.current) {
      ref.current.position.set(
        Math.tan(t) * initialPosition[0],
        (Math.cos(t) * Math.atan(t)) / Math.PI / 1.05 + initialPosition[1],
        Math.sin(t) * initialPosition[1]
      );
    }
  });

  return (
    <group>
      <Trail
        local
        width={1}
        length={10}
        color={new THREE.Color(1, 1, 10)}
        attenuation={(t) => t * t}
      >
        <mesh ref={ref}>
          <sphereGeometry args={[0.0001]} />
          <meshBasicMaterial color={[2, 1, 10]} toneMapped={false} />
        </mesh>
      </Trail>
    </group>
  );
};

const Scene = () => {
  return (
    <Canvas frameloop="demand" camera={{ position: [1, 4, 3], fov: 125 }}>
      <spotLight
        intensity={0.5}
        angle={0.2}
        penumbra={1}
        position={[1, 0, 10]}
      />

      <group>
        <Float>
          <Electron />
          <Electron />
          <Electron />
        </Float>

        <Float>
          <Electron />
          <Electron />
          <Electron />
        </Float>

        <Float>
          <Electron />
          <Electron />
          <Electron />
        </Float>

        <Float>
          <Electron />
          <Electron />
          <Electron />
        </Float>
      </group>

      <Sphere />

      <Stars saturation={0.8} count={500} speed={1} />

      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
      </EffectComposer>

      <Environment preset="city" background blur={0.2} />

      <Grading />
      <OrbitControls autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
};

export default Scene;
