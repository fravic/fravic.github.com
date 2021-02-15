import * as THREE from "three";
import { a } from "@react-spring/three";
import { a as aDom } from "@react-spring/web";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
} from "@react-three/postprocessing";
import ReactDOM from "react-dom";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, extend } from "react-three-fiber";

import { polynucleotideStrand } from "../molecules/generators";
import { useYScroll } from "./hooks";

const atomArrays = polynucleotideStrand(
  "GGCGAGGCCAGTTTCATTTGAGCATTAAATGTCAAGTTCTGCACGCTATCATCATCA"
);

const dummy = new THREE.Object3D();

function PolynucleotideStrand() {
  // This reference will give us direct access to the mesh
  const mesh = useRef<THREE.InstancedMesh | null>(null);

  const carbonCount = atomArrays.carbon.length;
  useFrame((state) => {
    const meshCurrent = mesh.current;
    if (meshCurrent === null) {
      return;
    }
    atomArrays.carbon.forEach((atom, i) => {
      const { pos } = atom;
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      meshCurrent.setMatrixAt(i, dummy.matrix);
    });
    meshCurrent.instanceMatrix.needsUpdate = true;
  });

  return (
    // @ts-ignore
    <instancedMesh ref={mesh} args={[null, null, carbonCount]}>
      <sphereBufferGeometry args={[0.3, 32, 32]} />
      <meshPhongMaterial color={0x777777} />
    </instancedMesh>
  );
}

export function Canvas3D() {
  const y = useYScroll([-1000, 0], window);
  return (
    <>
      <Canvas
        style={{ width: "100%", height: "100%", position: "absolute", top: 0 }}
        camera={{ position: [0, 5, 10], fov: 65, near: 2, far: 60 }}
        gl={{ alpha: false }}
      >
        <color attach="background" args={[1, 1, 1]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <a.group position-y={y.to((y: number) => y / 100)}>
          <PolynucleotideStrand />
        </a.group>
        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <aDom.div
        className="bar"
        style={{ height: y.to([-100, 2400], ["0%", "100%"]) }}
      />
    </>
  );
}
