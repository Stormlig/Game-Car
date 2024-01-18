/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Track } from "./models/Track";
import { Ground } from "./models/Ground";
import { Car } from "./models/Car";
import { Vector3 } from "react-three-fiber";

export function Scene() {
  const [thirdPerson, setThirdPerson] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<Vector3 | any>([
    -6, 3.9, 6.21,
  ]);

  useEffect(() => {
    function keyDownHanler(e: any) {
      if (e.key == "k") {
        if (thirdPerson)
          setCameraPosition([-6, 3.9, 6.21 + Math.random() * 0.02]);
        setThirdPerson(!thirdPerson);
      }
    }

    window.addEventListener("keydown", keyDownHanler);
    return () => window.removeEventListener("keydown", keyDownHanler);
  }, [thirdPerson]);

  return (
    <Suspense fallback={null}>
      <Environment files={"/envmap.hdr"} background={true} />

      <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
      {!thirdPerson && <OrbitControls target={[-2.64, -0.71, 0.03]} />}

      <Track />
      <Ground />
      <Car thirdPerson={thirdPerson} />
    </Suspense>
  );
}
