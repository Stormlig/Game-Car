import { Trail } from "@react-three/drei";
import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Lightning = () => {
  const ref: RefObject<THREE.Mesh> = useRef<THREE.Mesh>(null);
  const [initialPosition] = useState(() => {
    const x = 2;
    const y = 4;
    const z = 0;
    return [x, y, z];
  });

  const [delay, setDelay] = useState(10);

  useEffect(() => {
    const updatePosition = () => {
      const t = (Date.now() - 100 + delay) * 0.03;
      const a = (Date.now() - 100 + delay) * 0.02;
      const b = (Date.now() - 100 + delay) * 0.2;

      if (ref.current) {
        ref.current.position.set(
          Math.sin(t) * initialPosition[1],
          Math.tan(a) * initialPosition[0],
          Math.cos(b) * Math.atan(initialPosition[1])
        );
      }
    };

    const animationId = requestAnimationFrame(function animate() {
      updatePosition();
      animationId && requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [delay, initialPosition]);

  return (
    <Trail
      local={false}
      length={1}
      color={new THREE.Color(10, 1, 10)}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref}>
        <shaderMaterial clipShadows={true} shadowSide={2} />
      </mesh>
    </Trail>
  );
};
