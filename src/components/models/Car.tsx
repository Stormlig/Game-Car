import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useWheels } from "../../hook/useWheels";
import { WheelDebug } from "./WheelsDebug";
import { useControls } from "../../hook/useControls";
import { Mesh, Quaternion, Vector3 } from "three";

export function Car({ thirdPerson }) {
  const result = useLoader(GLTFLoader, "/range_rover_sport_2018.glb").scene;

  const position: [number, number, number] = [-1.5, 0.5, 3];
  const width: number = 0.15;
  const height: number = 0.07;
  const front: number = 0.15;
  const wheelRadius: number = 0.05;

  const chassisBodyArgs: [number, number, number] = [width, height, front * 2];

  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      args: chassisBodyArgs,
      mass: 150,
      position,
    }),
    useRef(null)
  );

  const { wheels, wheelInfos } = useWheels(width, height, front, wheelRadius);

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    useRef(null)
  );

  useControls(vehicleApi, chassisApi);

  //camera
  useFrame((state) => {
    if (!thirdPerson) return;

    const position = new Vector3(0, 0, 0);
    position.setFromMatrixPosition(chassisBody.current!.matrixWorld);

    const quaternion = new Quaternion(0, 0, 0);
    quaternion.setFromRotationMatrix(chassisBody.current!.matrixWorld);

    const wDir = new Vector3(0, 0, -1);
    wDir.applyQuaternion(quaternion);
    wDir.normalize();

    const CameraPosition = position.clone().add(
      wDir
        .clone()
        .multiplyScalar(-1)
        .add(new Vector3(0, 0.3, 0))
    );

    state.camera.position.copy(CameraPosition);
    state.camera.lookAt(position);
  });

  useEffect(() => {
    if (!result) return;

    result.scale.set(0.1, 0.1, 0.1);
    result.children[0].position.set(0, -0.19, 0);
    result.traverse((objcet) => {
      if (objcet instanceof Mesh) {
        objcet.castShadow = true;
        objcet.receiveShadow = true;
      }
    });
  }, [result]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    const wheel = result.children[0].children[0].children[0];

    // Aplique a rotação apenas ao eixo Y
    wheel.children[0].rotateX(t * 2);
    wheel.children[2].rotateX(t * 8);
    wheel.children[3].rotateX(t * 4);
    wheel.children[4].rotateX(t * 6);
  });

  return (
    <group ref={vehicle} name="vehicle">
      <group ref={chassisBody} name="chassisBody">
        <primitive
          object={result}
          rotation-y={Math.PI / 2}
          position={[0, -0.09, 0]}
        />
      </group>

      {/* <mesh ref={chassisBody} name="chassisBody">
        <meshBasicMaterial transparent={true} opacity={0.3} />
        <boxGeometry args={chassisBodyArgs} />
      </mesh> */}
      <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
      <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
      <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
      <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
    </group>
  );
}