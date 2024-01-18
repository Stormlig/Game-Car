/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, KeyboardEvent } from "react";

interface UseControlsState {
  w?: boolean;
  s?: boolean;
  a?: boolean;
  d?: boolean;
  arrowdown?: boolean;
  arrowup?: boolean;
  arrowleft?: boolean;
  arrowright?: boolean;
  r?: boolean;
  v?: boolean;
}

export function useControls(vehicleApi: any, chassisApi: any) {
  const [controls, setControls] = useState<UseControlsState>({});

  useEffect(() => {
    const keyDownPressHandler = (e: KeyboardEvent) => {
      setControls(() => ({
        ...controls,
        [e.key.toLowerCase()]: true,
      }));
    };

    const keyUpPressHandler = (e: KeyboardEvent) => {
      setControls(() => ({
        ...controls,
        [e.key.toLowerCase()]: false,
      }));
    };

    window.addEventListener(
      "keydown",
      keyDownPressHandler as unknown as EventListener
    );
    window.addEventListener(
      "keyup",
      keyUpPressHandler as unknown as EventListener
    );
    return () => {
      window.removeEventListener(
        "keydown",
        keyDownPressHandler as unknown as EventListener
      );

      window.removeEventListener(
        "keyup",
        keyUpPressHandler as unknown as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (!vehicleApi || !chassisApi) return;

    let engineForce = 0;
    let steeringValue = 0;

    if (controls.w) {
      engineForce = 150;
    } else if (controls.s) {
      engineForce = -150;
    }

    if (controls.d) {
      steeringValue += -0.45;
    }

    if (controls.a) {
      steeringValue += 0.45;
    }

    // engineForce
    vehicleApi.applyEngineForce(engineForce, 2);
    vehicleApi.applyEngineForce(engineForce, 3);

    // direction
    vehicleApi.setSteeringValue(steeringValue, 2);
    vehicleApi.setSteeringValue(steeringValue, 3);

    if (!controls.a && !controls.d) {
      for (let i = 0; i < 4; i++) {
        vehicleApi.setSteeringValue(0, i);
      }
    }

    // rotating chassis
    if (controls.arrowdown)
      chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, +1]);
    if (controls.arrowup) chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, -1]);
    if (controls.arrowleft)
      chassisApi.applyLocalImpulse([0, -5, 0], [-0.5, 0, 0]);
    if (controls.arrowright)
      chassisApi.applyLocalImpulse([0, -5, 0], [+0.5, 0, 0]);

    // // reset vehicle
    if (controls.r) {
      chassisApi.position.set(-1.5, 0.5, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }

    //set o valor para  100 / 50 / 25 / 0
    //pega o sinal pela tecla que foi clicada.
    //
  }, [controls, vehicleApi, chassisApi]);

  return controls;
}
