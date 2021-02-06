import { a } from "@react-spring/three";
import { a as aDom } from "@react-spring/web";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
} from "@react-three/postprocessing";
import ReactDOM from "react-dom";
import React, { useRef, useState } from "react";
import { Canvas, useFrame, extend } from "react-three-fiber";

import { useYScroll } from "./hooks";

type PropsType = { position: [number, number, number] };

function Box(props: PropsType) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export function Canvas3D() {
  const y = useYScroll([-100, 2400], window);
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
        <a.group position-z={y.to((y: number) => (y / 500) * 25)}>
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </a.group>
        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <aDom.div
        className="bar"
        style={{ height: y.interpolate([-100, 2400], ["0%", "100%"]) }}
      />
    </>
  );
}
