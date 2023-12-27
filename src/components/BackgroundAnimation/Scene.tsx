/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createContext, useContext, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Clouds,
  Cloud,
  CameraShake,
  Environment,
  OrbitControls,
  ContactShadows,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import {
  CuboidCollider,
  BallCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { random } from "maath";
import { Grading } from "./Grading";
import { Globe } from "./Globe";
import { Lightning } from "./Lightning";

const context = createContext<any>(null);

export default function App() {
  const shake = useRef();

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} />
      <Environment background preset="night" blur={0.1} />
      <Stars saturation={0.3} factor={1} speed={5} />

      <OrbitControls
        makeDefault
        autoRotate
        enableZoom={true}
        enablePan={false}
        maxDistance={60}
      />
      <Grading />
      <Globe />

      <PerspectiveCamera makeDefault position={[7, 19, 18]} fov={30}>
        <spotLight
          position={[0, 40, 2]}
          angle={0.5}
          decay={1}
          distance={45}
          penumbra={1}
          intensity={2000}
        />
        <spotLight
          position={[-19, 0, -8]}
          color="red"
          angle={0.25}
          decay={0.75}
          distance={185}
          penumbra={-1}
          intensity={400}
        />
      </PerspectiveCamera>

      <context.Provider value={shake}>
        <CameraShake
          ref={shake}
          decay
          decayRate={0.95}
          maxYaw={0.05}
          maxPitch={0.01}
          yawFrequency={4}
          pitchFrequency={2}
          rollFrequency={2}
          intensity={0}
        />
        <Clouds limit={400} material={THREE.MeshLambertMaterial}>
          <spotLight
            position={[0, 40, 2]}
            angle={0.5}
            decay={1}
            distance={45}
            penumbra={1}
          />

          <spotLight
            position={[-19, 0, -8]}
            color="#f10018b9"
            angle={0.25}
            decay={0.75}
            distance={185}
            penumbra={-1}
            intensity={400}
          />
          <Physics gravity={[0, 0, 0]}>
            <Pointer />
            <Puffycloud seed={30} position={[50, 5, 50]} />

            <Lightning />

            <Puffycloud seed={20} position={[12, 6, -50]} />
          </Physics>
        </Clouds>
      </context.Provider>
    </Canvas>
  );
}

function Puffycloud({
  seed,
  vec = new THREE.Vector3(),
  ...props
}: {
  [key: string]: any;
}) {
  const api = useRef<any>();
  const light = useRef<any>();
  const rig = useContext<any>(context);
  const [flash] = useState(
    () => new random.FlashGen({ count: 10, minDuration: 40, maxDuration: 200 })
  );
  const contact = (payload: {
    other: { rigidBodyObject?: { userData?: { cloud?: any } } };
    totalForceMagnitude: number;
  }) =>
    payload.other?.rigidBodyObject?.userData?.cloud &&
    payload.totalForceMagnitude / 1000 > 100 &&
    flash.burst();
  useFrame((state, delta) => {
    const impulse = flash.update(state.clock.elapsedTime, delta);
    light.current.intensity = impulse * 15000;
    if (impulse === 1) rig?.current?.setIntensity(1);
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(10)
    );
  });
  return (
    <RigidBody
      ref={api}
      userData={{ cloud: true }}
      onContactForce={contact}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      {...props}
      colliders={false}
    >
      <BallCollider args={[4]} />
      <Cloud
        seed={seed}
        fade={30}
        speed={0.1}
        growth={4}
        segments={40}
        volume={10}
        opacity={0.6}
        bounds={[10, 20, 50]}
      />
      <Cloud
        seed={seed + 1}
        fade={30}
        position={[55, 52, 82]}
        speed={0.1}
        growth={3}
        volume={10}
        opacity={0.5}
        bounds={[16, 10, 60]}
      />
      <pointLight
        position={[0, 0, 0.5]}
        ref={light}
        color="blue"
        intensity={0.8}
      />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3(), dir = new THREE.Vector3() }) {
  const ref = useRef<any>();
  useFrame(({ pointer, camera }) => {
    vec.set(pointer.x, pointer.y, 0.5).unproject(camera);
    dir.copy(vec).sub(camera.position).normalize();
    vec.add(dir.multiplyScalar(camera.position.length()));
    ref.current?.setNextKinematicTranslation(vec);
  });
  return (
    <RigidBody
      userData={{ cloud: true }}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[4]} />
    </RigidBody>
  );
}
