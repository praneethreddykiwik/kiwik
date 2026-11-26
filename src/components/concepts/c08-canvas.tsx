"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { clamp01, seeded, smooth01, useMessTexture, useShots } from "./gl-util";

const COUNT = 96;
const LW = 4.5;
const LD = 3;

const tileUv = (g: THREE.BufferGeometry, col: number, row: number) => {
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (col + uv.getX(i)) / 4, 1 - (row + 1 - uv.getY(i)) / 12);
  return g;
};

function Papers({ progress }: { progress: RefObject<number> }) {
  const gl = useThree((s) => s.gl);
  const map = useMessTexture(gl.domElement);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const front = useMemo(() => new THREE.MeshStandardMaterial({ map, roughness: 0.92, side: THREE.DoubleSide }), [map]);
  const sheets = useMemo(() => {
    const rnd = seeded(21);
    return Array.from({ length: COUNT }, (_, i) => {
      const g = new THREE.PlaneGeometry(1.5, 1.25, 8, 6);
      const p = g.attributes.position;
      const bend = (rnd() - 0.5) * 0.14;
      for (let k = 0; k < p.count; k++) p.setZ(k, bend * Math.pow(p.getX(k) / 0.75, 2) + Math.max(0, p.getX(k) * 0.5 + p.getY(k) * 0.5 - 0.42) * 0.26);
      tileUv(g, Math.floor(rnd() * 4), Math.floor(rnd() * 12));
      g.computeVertexNormals();
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd());
      return { g, pos: new THREE.Vector3(Math.cos(a) * r * 5.6, 0.03 + i * 0.0085, Math.sin(a) * r * 3.3), rot: rnd() * 6.28, s: 0.8 + rnd() * 0.6, delay: 0, wild: new THREE.Vector3(rnd() - 0.5, rnd(), rnd() - 0.5) };
    }).map((s) => ({ ...s, delay: clamp01((s.pos.x + 5.6) / 11.2) * 0.45 + (1 - s.pos.y) * 0.1 }));
  }, []);
  useEffect(() => () => { front.dispose(); sheets.forEach((s) => s.g.dispose()); }, [front, sheets]);
  useFrame(({ clock }) => {
    const p = progress.current;
    sheets.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      const k = clamp01((p * 1.75 - s.delay) / 0.7);
      const e = k * k;
      const flutter = k > 0 ? 0 : Math.max(0, Math.sin(clock.elapsedTime * 1.3 + i)) * 0.006 * (i > COUNT - 24 ? 1 : 0);
      m.visible = k < 1;
      m.position.set(s.pos.x + e * (9 + s.wild.x * 7), s.pos.y + flutter + Math.sin(k * Math.PI * 0.6) * (2.2 + s.wild.y * 3.4), s.pos.z + e * (s.wild.z * 8 - 1));
      m.rotation.set(-Math.PI / 2 + e * s.wild.y * 5 + flutter, e * s.wild.x * 5, s.rot + e * s.wild.z * 6);
    });
  });
  return <>{sheets.map((s, i) => <mesh key={i} ref={(el) => { refs.current[i] = el; }} geometry={s.g} material={front} scale={s.s} castShadow receiveShadow />)}</>;
}

function Laptop({ progress, tex, index }: { progress: RefObject<number>; tex: (THREE.Texture | null)[]; index: RefObject<number> }) {
  const lid = useRef<THREE.Group>(null);
  const base = useMemo(() => new RoundedBoxGeometry(LW, 0.14, LD, 6, 0.06), []);
  const cover = useMemo(() => new RoundedBoxGeometry(LW, LD, 0.09, 6, 0.04), []);
  const metal = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e3e5ea", roughness: 0.4, metalness: 0.2 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1b1d22", roughness: 0.6 }), []);
  const key = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2d33", roughness: 0.7 }), []);
  const screen = useMemo(() => new THREE.MeshBasicMaterial({ color: "#0c0f1c", toneMapped: false }), []);
  const keys = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const o = new THREE.Object3D();
    let n = 0;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) { o.position.set(-1.82 + c * 0.28, 0.085, -0.98 + r * 0.27); o.updateMatrix(); keys.current?.setMatrixAt(n++, o.matrix); }
    if (keys.current) keys.current.instanceMatrix.needsUpdate = true;
  }, []);
  useEffect(() => () => { [base, cover].forEach((g) => g.dispose()); [metal, dark, key, screen].forEach((m) => m.dispose()); }, [base, cover, metal, dark, key, screen]);
  const shown = useRef(-1);
  useFrame(() => {
    const open = smooth01((progress.current - 0.42) / 0.4);
    if (lid.current) lid.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, -0.24, open);
    const t = tex[index.current] || null;
    const want = t ? index.current : -2;
    if (shown.current !== want) {
      shown.current = want;
      screen.map = t;
      screen.needsUpdate = true;
    }
    const lum = smooth01((progress.current - 0.6) / 0.2);
    screen.color.setScalar(t ? lum : 0.05);
  });
  return (
    <group position={[0, 0.08, 0]}>
      <mesh geometry={base} material={metal} castShadow receiveShadow />
      <mesh position={[0, 0.072, -0.4]} rotation={[-Math.PI / 2, 0, 0]} material={dark}><planeGeometry args={[4.1, 1.6]} /></mesh>
      <instancedMesh ref={keys} args={[undefined, undefined, 70]} material={key}><boxGeometry args={[0.24, 0.03, 0.22]} /></instancedMesh>
      <mesh position={[0, 0.073, 0.85]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.5, 0.85]} /><meshStandardMaterial color="#b4b8c0" roughness={0.4} metalness={0.5} /></mesh>
      <group ref={lid} position={[0, 0.1, -LD / 2 + 0.03]}>
        <mesh geometry={cover} material={metal} position={[0, LD / 2, -0.04]} castShadow />
        <mesh position={[0, LD / 2, 0.007]} material={dark}><planeGeometry args={[LW - 0.06, LD - 0.06]} /></mesh>
        <mesh position={[0, LD / 2 + 0.02, 0.012]} material={screen}><planeGeometry args={[LW - 0.24, (LW - 0.24) / 1.6]} /></mesh>
      </group>
    </group>
  );
}

function Things({ progress }: { progress: RefObject<number> }) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const body = useMemo(() => new RoundedBoxGeometry(0.9, 0.12, 1.8, 5, 0.06), []);
  const calc = useMemo(() => new RoundedBoxGeometry(1.1, 0.16, 1.6, 5, 0.06), []);
  useEffect(() => () => { body.dispose(); calc.dispose(); }, [body, calc]);
  useFrame(() => {
    const k = smooth01((progress.current - 0.1) / 0.5);
    if (left.current) left.current.position.x = -k * 1.2;
    if (right.current) { right.current.position.x = k * 9; right.current.position.y = k * 2; right.current.rotation.z = -k * 2; }
  });
  return (
    <>
      <group ref={left}>
        <group position={[-4.9, 0, 1.6]}>
          <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.46, 0.4, 1.1, 40]} /><meshStandardMaterial color="#f4f4f0" roughness={0.35} /></mesh>
          <mesh position={[0, 1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.4, 40]} /><meshStandardMaterial color="#3d2416" roughness={0.3} /></mesh>
          <mesh position={[-0.52, 0.56, 0]} castShadow><torusGeometry args={[0.24, 0.06, 14, 30]} /><meshStandardMaterial color="#f4f4f0" roughness={0.35} /></mesh>
        </group>
      </group>
      <group ref={right}>
        <mesh geometry={body} position={[4.1, 0.95, 1.5]} rotation={[0, 0.4, 0]} castShadow><meshStandardMaterial color="#15161a" roughness={0.25} /></mesh>
        <mesh geometry={calc} position={[3.4, 0.95, -1.7]} rotation={[0, -0.3, 0]} castShadow><meshStandardMaterial color="#39404a" roughness={0.5} /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[3.4 + ((i % 3) - 1) * 0.28, 1.05, -1.5 + Math.floor(i / 3) * 0.26 - 0.3]} rotation={[0, -0.3, 0]}><boxGeometry args={[0.2, 0.05, 0.18]} /><meshStandardMaterial color={i === 11 ? "#ff8a4c" : "#d9dde3"} /></mesh>)}
      </group>
    </>
  );
}

function Scene({ progress, index, shots, onReady }: { progress: RefObject<number>; index: RefObject<number>; shots: string[]; onReady: () => void }) {
  const { camera, size } = useThree();
  const tex = useShots(shots, 1.6);
  const n = useRef(0);
  const eased = useRef(0);
  const from = useMemo(() => new THREE.Vector3(0, 11.2, 5.6), []);
  const to = useMemo(() => new THREE.Vector3(0, 2.9, 8.4), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ pointer }, dt) => {
    eased.current += (progress.current - eased.current) * (1 - Math.exp(-Math.min(dt, 0.05) * 6));
    const k = smooth01((eased.current - 0.3) / 0.6);
    const narrow = size.width / size.height < 1;
    const wide = !narrow;
    camera.position.lerpVectors(from, to, k);
    camera.position.x += pointer.x * 0.5 + (wide ? 1.5 * k : 0);
    if (narrow) camera.position.multiplyScalar(1.45 + 0.1 * k);
    look.set(wide ? 1.5 * k : 0, 0.2 + 1.25 * k - (narrow ? 0.9 * k : 0), THREE.MathUtils.lerp(0.5, -0.6, k));
    camera.lookAt(look);
    if (++n.current === 4) onReady();
  });
  return (
    <>
      <color attach="background" args={["#e2d8c7"]} />
      <fog attach="fog" args={["#e2d8c7", 15, 34]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[-6, 10, 5]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0005} shadow-normalBias={0.02} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 50]} /><meshStandardMaterial color="#f1e8d8" roughness={0.9} /></mesh>
      <Laptop progress={eased} tex={tex} index={index} />
      <Things progress={eased} />
      <Papers progress={eased} />
    </>
  );
}

export default function DeskCanvas(props: { progress: RefObject<number>; index: RefObject<number>; shots: string[]; onReady: () => void }) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ fov: 42, position: [0, 11, 5.6] }} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ touchAction: "pan-y" }}>
      <Scene {...props} />
    </Canvas>
  );
}
