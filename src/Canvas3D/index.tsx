import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import React, { useEffect, useRef, useMemo } from "react";
import { Canvas, useThree, useFrame } from "react-three-fiber";

import { CapsuleBufferGeometry } from "../lib/three-js-capsule-geometry";
import { polynucleotideStrand } from "../generators/generators";
import { fasta } from "../sequence.fa";
import {
  EntityType,
  ADENINE,
  CYTOSINE,
  GUANINE,
  THYMINE,
  NucleotideLetterType,
} from "../generators/types";

const entities = polynucleotideStrand(fasta.split("\n")[1]);

const BACKBONE_COLOR = 0x8d99ae;
const BACKBONE_RADIUS = 0.25;
const BACKBONE_SPHERE_WIDTH_SEGMENTS = 12;
const BACKBONE_SPHERE_HEIGHT_SEGMENTS = 12;

const BASE_COLORS = {
  [ADENINE]: 0xe07a5f,
  [CYTOSINE]: 0x8ecae6,
  [GUANINE]: 0x81b29a,
  [THYMINE]: 0xf2cc8f,
};

const CONTAINER_ROTATION_SPEED_RAD = 0.002;

const dummy = new THREE.Object3D();

function populateMesh(
  mesh: THREE.InstancedMesh | null,
  entities: Array<EntityType>
) {
  if (mesh === null) {
    return;
  }
  entities.forEach((ent, i) => {
    const { pos, rot, scale } = ent;
    dummy.position.set(pos.x, pos.y, pos.z);
    dummy.rotation.set(rot.x, rot.y, rot.z);
    dummy.scale.set(scale.x, scale.y, scale.z);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

function PolynucleotideStrand() {
  const backboneMesh = useRef<THREE.InstancedMesh | null>(null);
  const containerRef = useRef<THREE.InstancedMesh | null>(null);

  useFrame((state) => {
    const curRef = containerRef.current;
    if (curRef) {
      curRef.rotation.y += CONTAINER_ROTATION_SPEED_RAD;
    }

    populateMesh(backboneMesh.current, entities.backbone);
  });

  return (
    <group ref={containerRef}>
      <instancedMesh
        ref={backboneMesh}
        // @ts-ignore
        args={[null, null, entities.backbone.length]}
      >
        <sphereBufferGeometry
          args={[
            BACKBONE_RADIUS,
            BACKBONE_SPHERE_WIDTH_SEGMENTS,
            BACKBONE_SPHERE_HEIGHT_SEGMENTS,
          ]}
        />
        <meshToonMaterial color={BACKBONE_COLOR} />
      </instancedMesh>

      <BaseInstancedMesh letter={ADENINE} />
      <BaseInstancedMesh letter={CYTOSINE} />
      <BaseInstancedMesh letter={GUANINE} />
      <BaseInstancedMesh letter={THYMINE} />
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
    ref.current.position.set(0, 10, window.innerWidth < 768 ? 15 : 10);
    ref.current.updateMatrixWorld();
  });
  return <perspectiveCamera ref={ref} fov={65} near={2} far={60} />;
}

export function Canvas3D() {
  return (
    <>
      <Canvas
        className="canvas"
        gl={{ alpha: true }}
        pixelRatio={window.devicePixelRatio}
      >
        <Camera />
        <color attach="background" args={[1, 1, 1]} />
        <ambientLight color={0xeeeeee} intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PolynucleotideStrand />
        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
    </>
  );
}

const BASE_RADIUS = 0.2;
const BASE_CAP_SEGMENTS = 3;
const BASE_RADIAL_SEGMENTS = 8;
const BASE_LENGTH = 1.2;
function BaseInstancedMesh(props: { letter: NucleotideLetterType }) {
  const baseMesh = useRef<THREE.InstancedMesh | null>(null);
  const capsuleGeometry = useMemo(
    () =>
      new CapsuleBufferGeometry(
        BASE_RADIUS,
        BASE_RADIUS,
        BASE_LENGTH,
        BASE_RADIAL_SEGMENTS,
        1,
        BASE_CAP_SEGMENTS,
        BASE_CAP_SEGMENTS
      ),
    []
  );
  useFrame((state) => {
    populateMesh(baseMesh.current, entities[props.letter]);
  });
  return (
    <instancedMesh
      ref={baseMesh}
      // @ts-ignore
      args={[capsuleGeometry, null, entities[props.letter].length]}
    >
      <meshToonMaterial color={BASE_COLORS[props.letter]} />
    </instancedMesh>
  );
}
