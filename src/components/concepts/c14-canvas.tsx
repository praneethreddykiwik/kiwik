"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { DRAWERS } from "./screens-draw";

type Kind = keyof typeof DRAWERS;

function slab(w: number, h: number, d: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 10 });
  g.translate(0, 0, -d / 2);
  return g;
}

/** A canvas that redraws a product screen a few times a second. */
function useScreen(kind: Kind, px: [number, number]) {
  const { canvas, tex } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = px[0];
    c.height = px[1];
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { canvas: c, tex: t };
  }, [px]);
  const last = useRef(-1);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (t - last.current < 0.08) return;
    last.current = t;
    DRAWERS[kind](canvas.getContext("2d")!, canvas.width, canvas.height, t);
    tex.needsUpdate = true;
  });
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

const BODY = new THREE.MeshStandardMaterial({ color: "#e9ecf3", metalness: 0.55, roughness: 0.32 });
const DARK = new THREE.MeshStandardMaterial({ color: "#14182c", metalness: 0.3, roughness: 0.5 });

function Laptop() {
  const tex = useScreen("website", PX_WIDE);
  const lid = useMemo(() => slab(4.2, 2.7, 0.08, 0.14), []);
  const base = useMemo(() => slab(4.2, 2.9, 0.1, 0.18), []);
  return (
    <group>
      <mesh geometry={base} material={BODY} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 1.42]} />
      <group position={[0, -1.32, 0]} rotation={[-0.18, 0, 0]}>
        <mesh geometry={lid} material={DARK} position={[0, 1.35, -0.02]} />
        <mesh position={[0, 1.38, 0.065]}>
          <planeGeometry args={[3.95, 2.45]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Device({ kind, size, px, ...rest }: { kind: Kind; size: [number, number]; px: [number, number] } & ThreeElements["group"]) {
  const tex = useScreen(kind, px);
  const body = useMemo(() => slab(size[0], size[1], 0.09, Math.min(size[0], size[1]) * 0.14), [size]);
  return (
    <group {...rest}>
      <mesh geometry={body} material={DARK} />
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[size[0] * 0.92, size[1] * 0.94]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

const PX_WIDE: [number, number] = [1024, 634];
const PX_TALL: [number, number] = [420, 860];
const PX_TAB: [number, number] = [1024, 720];

/** The pointer anywhere on the page, -1 to 1, since the canvas itself ignores the mouse. */
export function useWindowPointer() {
  const p = useMemo(() => ({ x: 0, y: 0 }), []);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [p]);
  return p;
}

function Rig({ onReady }: { onReady: () => void }) {
  const root = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const tab = useRef<THREE.Group>(null);
  const frames = useRef(0);
  const pointer = useWindowPointer();
  const { camera, size } = useThree();
  useEffect(() => {
    // The three devices span about 11 units: keep them all in frame on a narrow screen.
    const aspect = size.width / size.height;
    camera.position.z = Math.max(8.6, 11.5 / aspect / (2 * Math.tan((38 * Math.PI) / 360)));
    camera.updateProjectionMatrix();
  }, [camera, size]);
  useFrame(({ clock }) => {
    if (++frames.current === 3) onReady();
    const t = clock.elapsedTime;
    const g = root.current!;
    g.rotation.y += (pointer.x * 0.25 - g.rotation.y) * 0.05;
    g.rotation.x += (-pointer.y * 0.12 + 0.12 - g.rotation.x) * 0.05;
    phone.current!.position.y = -0.2 + Math.sin(t * 1.1) * 0.12;
    phone.current!.rotation.y = -0.35 + Math.sin(t * 0.7) * 0.06;
    tab.current!.position.y = 0.25 + Math.sin(t * 0.9 + 1) * 0.1;
  });
  return (
    <group ref={root}>
      <Laptop />
      <group ref={tab} position={[-3.9, 0.25, -1.2]} rotation={[0, 0.42, 0]}>
        <Device kind="dashboard" size={[3.1, 2.2]} px={PX_TAB} />
      </group>
      <group ref={phone} position={[3.6, -0.2, 0.6]} rotation={[0, -0.35, 0]}>
        <Device kind="app" size={[1.15, 2.35]} px={PX_TALL} />
      </group>
    </group>
  );
}

export default function DevicesCanvas({ onReady = () => {} }: { onReady?: () => void }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.5, 8.6], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} style={{ pointerEvents: "none" }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />
      <directionalLight position={[-6, 2, -3]} intensity={0.8} color="#9fe8dd" />
      <Rig onReady={onReady} />
    </Canvas>
  );
}
