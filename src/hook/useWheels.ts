import {
  BodyProps,
  CompoundBodyProps,
  ShapeType,
  WheelInfoOptions,
  useCompoundBody,
} from "@react-three/cannon";
import { useRef } from "react";
import { Object3D } from "three";

export const useWheels = (
  width: number,
  height: number,
  front: number,
  radius: number
) => {
  const wheels = [
    useRef<Object3D | null>(null),
    useRef<Object3D | null>(null),
    useRef<Object3D | null>(null),
    useRef<Object3D | null>(null),
  ];

  const wheelInfo: WheelInfoOptions = {
    radius,
    directionLocal: [0, -1, 0],
    axleLocal: [1, 0, 0],
    suspensionStiffness: 60,
    suspensionRestLength: 0.1,
    frictionSlip: 1.5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    maxSuspensionTravel: 0.1,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  const wheelInfos: WheelInfoOptions[] = [
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.65, height * 0.4, front],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.65, height * 0.4, front],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.65, height * 0.4, -front],
      isFrontWheel: false,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.65, height * 0.4, -front],
      isFrontWheel: false,
    },
  ];

  const propsFunc = (): CompoundBodyProps => ({
    collisionFilterGroup: 0,
    mass: 1,
    shapes: [
      {
        args: [wheelInfo.radius, wheelInfo.radius, 0.5, 16],
        rotation: [0, 0, -Math.PI / 2],
        type: "Cylinder",
      } as BodyProps & {
        type: ShapeType;
      },
    ],
    type: "Kinematic",
  });

  useCompoundBody(propsFunc, wheels[0]);
  useCompoundBody(propsFunc, wheels[1]);
  useCompoundBody(propsFunc, wheels[2]);
  useCompoundBody(propsFunc, wheels[3]);



  return { wheels, wheelInfos };
};
