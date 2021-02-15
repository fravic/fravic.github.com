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
import { AtomType } from "../molecules/types";
import { useYScroll } from "./hooks";

const atomArrays = polynucleotideStrand(
  "GGCGAGGCCAGTTTCATTTGAGCATTAAATGTCAAGTTCTGCACGCTATCATCATCA"
);

const CARBON_COLOR = 0x7e7e7e;
const OXYGEN_COLOR = 0xf29e8e;
const NITROGEN_COLOR = 0x8f84f7;
const PHOSPHORUS_COLOR = 0xfffe92;

const ATOM_WIDTH_SEGMENTS = 12;
const ATOM_HEIGHT_SEGMENTS = 12;

const CARBON_RADIUS = 0.25;
const OXYGEN_RADIUS = 0.15;
const NITROGEN_RADIUS = 0.2;
const PHOSPHORUS_RADIUS = 0.3;

const dummy = new THREE.Object3D();

function populateMesh(
  mesh: THREE.InstancedMesh | null,
  atoms: Array<AtomType>
) {
  if (mesh === null) {
    return;
  }
  atoms.forEach((atom, i) => {
    const { pos } = atom;
    dummy.position.set(pos[0], pos[1], pos[2]);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

function PolynucleotideStrand() {
  const carbonMesh = useRef<THREE.InstancedMesh | null>(null);
  const oxygenMesh = useRef<THREE.InstancedMesh | null>(null);
  const nitrogenMesh = useRef<THREE.InstancedMesh | null>(null);
  const phosphorusMesh = useRef<THREE.InstancedMesh | null>(null);

  useFrame((state) => {
    populateMesh(carbonMesh.current, atomArrays.carbon);
    populateMesh(oxygenMesh.current, atomArrays.oxygen);
    populateMesh(nitrogenMesh.current, atomArrays.nitrogen);
    populateMesh(phosphorusMesh.current, atomArrays.phosphorus);
  });

  return (
    <a.group>
      <instancedMesh
        ref={carbonMesh}
        // @ts-ignore
        args={[null, null, atomArrays.carbon.length]}
      >
        <sphereBufferGeometry
          args={[CARBON_RADIUS, ATOM_WIDTH_SEGMENTS, ATOM_HEIGHT_SEGMENTS]}
        />
        <meshPhongMaterial color={CARBON_COLOR} />
      </instancedMesh>

      {/* @ts-ignore */}
      <instancedMesh
        ref={oxygenMesh}
        // @ts-ignore
        args={[null, null, atomArrays.oxygen.length]}
      >
        <sphereBufferGeometry
          args={[OXYGEN_RADIUS, ATOM_WIDTH_SEGMENTS, ATOM_HEIGHT_SEGMENTS]}
        />
        <meshPhongMaterial color={OXYGEN_COLOR} />
      </instancedMesh>

      {/* @ts-ignore */}
      <instancedMesh
        ref={nitrogenMesh}
        // @ts-ignore
        args={[null, null, atomArrays.nitrogen.length]}
      >
        <sphereBufferGeometry
          args={[NITROGEN_RADIUS, ATOM_WIDTH_SEGMENTS, ATOM_HEIGHT_SEGMENTS]}
        />
        <meshPhongMaterial color={NITROGEN_COLOR} />
      </instancedMesh>

      <instancedMesh
        ref={phosphorusMesh}
        // @ts-ignore
        args={[null, null, atomArrays.phosphorus.length]}
      >
        <sphereBufferGeometry
          args={[PHOSPHORUS_RADIUS, ATOM_WIDTH_SEGMENTS, ATOM_HEIGHT_SEGMENTS]}
        />
        <meshPhongMaterial color={PHOSPHORUS_COLOR} />
      </instancedMesh>
    </a.group>
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
