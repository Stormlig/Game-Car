/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useKeys, KeyConfig } from './useKeys';

interface UseControlsState {
  forward?: boolean;
  backward?: boolean;
  left?: boolean;
  right?: boolean;
  brake?: boolean;
  stop?: boolean;
}

export function useControls(vehicleApi: any, chassisApi: any) {
  const [controls, setControls] = useState<UseControlsState>({});

  const keyConfig: KeyConfig[] = [
    { keys: ["w"], fn: (pressed) => setControls((prev) => ({ ...prev, forward: pressed })) },
    { keys: ["s"], fn: (pressed) => setControls((prev) => ({ ...prev, backward: pressed })) },
    { keys: ["d"], fn: (pressed) => setControls((prev) => ({ ...prev, left: pressed })) },
    { keys: ["a"], fn: (pressed) => setControls((prev) => ({ ...prev, right: pressed })) },
    { keys: [" "], fn: (pressed) => setControls((prev) => ({ ...prev, brake: pressed })) },
    { keys: ["r"], fn: (pressed) => setControls((prev) => ({ ...prev, stop: pressed })) },

    // Adicione mais teclas conforme necessário
  ];

  useKeys(keyConfig);

  useEffect(() => {
    let engineForce = 0;
    let brakeForce = 0
    const maxBrake = 100;

    if (controls.forward && !controls.backward) {
      engineForce = 150;
    } else if (controls.backward && !controls.forward) {
      engineForce = -150;
    } 
    
    if ( controls.brake){
        brakeForce = maxBrake / 36 ;
      if(brakeForce === 0) {
      vehicleApi.setSteeringValue(0);
      }
    }

    // adjust direction
    if (controls.right) {
      vehicleApi.setSteeringValue(0.35, 2);
      vehicleApi.setSteeringValue(0.35, 3);
      vehicleApi.setSteeringValue(-0.1, 0);
      vehicleApi.setSteeringValue(-0.1, 1);
    } else if (controls.left) {
      vehicleApi.setSteeringValue(-0.35, 2);
      vehicleApi.setSteeringValue(-0.35, 3);
      vehicleApi.setSteeringValue(0.1, 0);
      vehicleApi.setSteeringValue(0.1, 1);
    } else {
      for(let i = 0; i < 4; i++) {
        vehicleApi.setSteeringValue(0, i);
      }
    }

    // Apply brakeForce
    for (let i = 2; i < 4; i++) {
      vehicleApi.setBrake(brakeForce, i);
      chassisApi.angularVelocity.set(0, 0, 0);
    }
    // apply acceleration
    for (let i = 2; i < 4; i++) {
      vehicleApi.applyEngineForce(engineForce, i);
    }

    // if (controls.arrowdown)  chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, +1]);
    // if (controls.arrowup)    chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, -1]);
    // if (controls.arrowleft)  chassisApi.applyLocalImpulse([0, -5, 0], [-0.5, 0, 0]);
    // if (controls.arrowright) chassisApi.applyLocalImpulse([0, -5, 0], [+0.5, 0, 0]);

// reset the position
    if (controls.stop) {
      chassisApi.position.set(-1.5, 0.5, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }
  }, [controls, vehicleApi, chassisApi]);

  return controls;
}
