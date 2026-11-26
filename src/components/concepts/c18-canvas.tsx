"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useWindowPointer } from "./c14-canvas";

const COLS = 46;
const ROWS = 18;
const GAP = 0.36;

function Field({ dark, onReady }: { dark: boolean; onReady: () => void }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const pointer = useWindowPointer();
  const frames = useRef(0);
  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(0.26, 1, 0.26);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.15 }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const low = useMemo(() => new THREE.Color(dark ? "#232a5c" : "#c7d2ff"), [dark]);
  const high = useMemo(() => new THREE.Color(dark ? "#5ee0d0" : "#1a2150"), [dark]);
  const glow = useMemo(() => new THREE.Color("#0d8a80"), []);
  const c = useMemo(() => new THREE.Color(), []);
  useEffect(() => () => {
    geo.dispose();
    mat.dispose();
  }, [geo, mat]);

  useFrame(({ clock }) => {
    if (++frames.current === 3) onReady();
    const t = clock.elapsedTime;
    const m = mesh.current!;
    let k = 0;
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const x = (i - COLS / 2) * GAP;
        const z = (j - ROWS / 2) * GAP;
        // A rising trend from left to right, with a slow swell running through it.
        const trend = (i / COLS) * 1.6;
        const swell = Math.sin(i * 0.28 - t * 1.1) * 0.45 + Math.cos(j * 0.45 + t * 0.7) * 0.3;
        const h = Math.max(0.08, 0.35 + trend + swell + Math.sin(i * 1.7 + j * 2.3) * 0.12);
        dummy.position.set(x, 0, z);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        m.setMatrixAt(k, dummy.matrix);
        const n = Math.min(1, h / 2.6);
        c.copy(low).lerp(high, n);
        if (h > 2.45) c.lerp(glow, 0.7);
        m.setColorAt(k, c);
        k++;
      }
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    const g = group.current!;
    g.rotation.y += (-0.38 + pointer.x * 0.18 - g.rotation.y) * 0.04;
  });

  return (
    <group ref={group} rotation={[0, -0.38, 0]} position={[0, -1.4, 0]}>
      <instancedMesh ref={mesh} args={[geo, mat, COLS * ROWS]} />
    </group>
  );
}

export default function DataCanvas({ dark = false, onReady = () => {} }: { dark?: boolean; onReady?: () => void }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 5.6, 11.5], fov: 40 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)} gl={{ alpha: true, powerPreference: "low-power" }} style={{ pointerEvents: "none" }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 4]} intensity={2.4} />
      <directionalLight position={[-6, 3, -4]} intensity={0.7} color="#9fe8dd" />
      <Field dark={dark} onReady={onReady} />
    </Canvas>
  );
}
