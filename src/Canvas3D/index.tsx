import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import React, { useCallback, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "react-three-fiber";

import { polynucleotideStrand } from "../molecules/generators";
import { AtomType } from "../molecules/types";
import { fasta } from "../sequence.fa";

const atomArrays = polynucleotideStrand(fasta.split("\n")[1]);

const CARBON_COLOR = 0x7e7e7e;
const OXYGEN_COLOR = 0xf29e8e;
const NITROGEN_COLOR = 0x8f84f7;
const PHOSPHORUS_COLOR = 0xfffe92;

const ATOM_WIDTH_SEGMENTS = 12;
const ATOM_HEIGHT_SEGMENTS = 12;

const CARBON_RADIUS = 0.125;
const OXYGEN_RADIUS = 0.075;
const NITROGEN_RADIUS = 0.1;
//const PHOSPHORUS_RADIUS = 0.3;
const PHOSPHORUS_RADIUS = 0.1;

const CONTAINER_ROTATION_SPEED_RAD = 0.002;

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

  const containerRef = useRef<THREE.InstancedMesh | null>(null);

  useFrame((state) => {
    const curRef = containerRef.current;
    if (curRef) {
      curRef.rotation.y += CONTAINER_ROTATION_SPEED_RAD;
    }

    populateMesh(carbonMesh.current, atomArrays.carbon);
    populateMesh(oxygenMesh.current, atomArrays.oxygen);
    populateMesh(nitrogenMesh.current, atomArrays.nitrogen);
    populateMesh(phosphorusMesh.current, atomArrays.phosphorus);
  });

  return (
    <group ref={containerRef}>
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
    </group>
  );
}

function Camera() {
  const ref = useRef<THREE.PerspectiveCamera>();
  const { setDefaultCamera } = useThree();
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setDefaultCamera(ref.current);
  }, [setDefaultCamera]);
  useFrame(() => {
    if (!ref.current) {
      return;
    }
    ref.current.lookAt(0, 10, 10);
    ref.current.position.set(0, 10, 10);
    ref.current.updateMatrixWorld();
  });
  return <perspectiveCamera ref={ref} fov={65} near={2} far={60} />;
}

export function Canvas3D() {
  return (
    <>
      <Canvas className="canvas" gl={{ alpha: false }}>
        <Camera />
        <color attach="background" args={[1, 1, 1]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <PolynucleotideStrand />
        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
    </>
  );
}
