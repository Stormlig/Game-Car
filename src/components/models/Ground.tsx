/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { usePlane } from "@react-three/cannon";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useLoader } from "react-three-fiber";
import { BufferAttribute, BufferGeometry, Mesh, TextureLoader } from "three";

interface ExtendedMesh extends Mesh {
  geometry: BufferGeometry;
}

export function Ground() {
  const [] = usePlane(
    () => ({
      type: "Static",
      rotation: [-Math.PI / 2, 0, 0],
    }),
    useRef(null)
  );

  const gridMap = useLoader(TextureLoader, "/textures/grid.png");

  const aoMap = useLoader(TextureLoader, "/textures/ground-ao.png");

  const alphaMap = useLoader(TextureLoader, "/textures/alpha-map.png");

  const meshRef = useRef<ExtendedMesh | null>(null);
  const meshRef2 = useRef<ExtendedMesh | null>(null);

  useEffect(() => {
    if (!gridMap) return;

    gridMap.anisotropy = 16;
  }, [gridMap]);

  useEffect(() => {
    if (meshRef.current) {
      const uvs = meshRef.current.geometry.attributes.uv.array;
      meshRef.current.geometry.setAttribute("uv2", new BufferAttribute(uvs, 2));
    }

    if (meshRef2.current) {
      const uvs = meshRef2.current.geometry.attributes.uv.array;
      meshRef2.current.geometry.setAttribute(
        "uv2",
        new BufferAttribute(uvs, 2)
      );
    }
  }, [meshRef.current]);

  return (
    <>
      <mesh
        ref={meshRef2}
        position={[-2.285, -0.01, -1.325]}
        rotation-x={-Math.PI * 0.5}
      >
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial
          opacity={0.325}
          alphaMap={gridMap}
          transparent={true}
          color={"white"}
        />
      </mesh>

      <mesh
        ref={meshRef}
        position={[-2.285, -0.015, -1.325]}
        rotation-x={-Math.PI * 0.5}
        rotation-z={-0.079}
      >
        <circleGeometry args={[6.12, 50]} />
        <MeshReflectorMaterial
          aoMap={aoMap}
          alphaMap={alphaMap}
          transparent={true}
          color={[0.6, 0.6, 0.6]}
          envMapIntensity={0.35}
          metalness={0.05}
          roughness={0.4}
          dithering={true}
          blur={[1024, 512]}
          mixBlur={3}
          mixStrength={30}
          mixContrast={1}
          resolution={1024}
          mirror={0}
          depthScale={0}
          minDepthThreshold={0.9}
          maxDepthThreshold={1}
          depthToBlurRatioBias={0.25}
          reflectorOffset={0.02}
        />
      </mesh>
    </>
  );
}
