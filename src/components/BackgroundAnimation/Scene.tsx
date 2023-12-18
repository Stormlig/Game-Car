/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Effects,
  useTexture,
  Line,
  Float,
  Stars,
  Trail,
} from "@react-three/drei";
import { LUTPass, LUTCubeLoader } from "three-stdlib";
import { useEffect, useMemo, useRef, useState } from "react";
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
        clearcoat={5}
        clearcoatRoughness={0}
        roughness={1}
        metalness={0.5}
        emissive={0}
      />
    </mesh>
  );
}

const Electron = ({ radius = 2.75, speed = 6, ...props }) => {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (ref.current) {
      ref.current.position.set(
        Math.tan(t) * radius,
        (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25,
        Math.tan(t) * radius
      );
    }
  });

  return (
    <group {...props}>
      <Trail
        local
        width={3}
        length={8}
        color={new THREE.Color(2, 1, 10)}
        attenuation={(t) => t * t}
      >
        <mesh ref={ref}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={[1, 1, 10]} toneMapped={false} />
        </mesh>
      </Trail>
    </group>
  );
};

const Scene = () => {
  return (
    <Canvas frameloop="demand" camera={{ position: [0, 0, 5], fov: 65 }}>
      <spotLight
        intensity={1}
        angle={0.2}
        penumbra={1}
        position={[1, 15, 10]}
      />

      <group>
        {[0, 2, -2].map((x, index) => (
          <Float
            key={index}
            speed={4}
            rotationIntensity={1}
            floatIntensity={2}
            position={[x, 0, 0]}
          >
            <Electron />
          </Float>
        ))}
      </group>

      <Sphere />

      <Stars saturation={0} count={500} speed={0.5} />

      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
      </EffectComposer>

      <Environment preset="dawn" background blur={0.6} />

      <Grading />
      <OrbitControls autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
};

export default Scene;
