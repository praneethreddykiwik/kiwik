"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { clamp01, seeded, smooth01, useMessTexture } from "./gl-util";

/** One sheet of paper, in scene units. A stack holds 500. */
const SHEET = 0.0062;
const PER_STACK = 500;
const PER_CHUNK = 25;
const CHUNKS = PER_STACK / PER_CHUNK;
const MAX_STACKS = 40;
const W = 1.5;
const D = 1.12;

/** Where the nth stack stands: filling outwards from the middle. */
const SPOTS = (() => {
  const all: [number, number][] = [];
  for (let x = -4; x <= 4; x++) for (let z = -3; z <= 3; z++) all.push([x, z]);
  return all.sort((a, b) => Math.hypot(a[0] * 1.02, a[1] * 1.15) - Math.hypot(b[0] * 1.02, b[1] * 1.15)).slice(0, MAX_STACKS);
})();

export interface PileControl {
  sheets: number;
  kept: number;
}

function Pile({ control, onReady }: { control: RefObject<PileControl>; onReady: () => void }) {
  const { gl, camera, size } = useThree();
  const mess = useMessTexture(gl.domElement, 1024);
  const body = useRef<THREE.InstancedMesh>(null);
  const tops = useRef<(THREE.Mesh | null)[]>([]);
  const flying = useRef<(THREE.Mesh | null)[]>([]);
  const n = useRef(0);
  const shown = useRef(0);
  const box = useMemo(() => new THREE.BoxGeometry(W, 1, D), []);
  const side = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 128;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fbfaf5";
    x.fillRect(0, 0, 64, 128);
    const rnd = seeded(4);
    for (let i = 0; i < PER_CHUNK; i++) {
      x.fillStyle = `rgba(40,36,20,${0.12 + rnd() * 0.22})`;
      x.fillRect(0, (i * 128) / PER_CHUNK, 64, 1.5);
      if (rnd() > 0.8) { x.fillStyle = rnd() > 0.5 ? "#f3dc78" : "#f0c3b8"; x.fillRect(0, (i * 128) / PER_CHUNK + 1.5, 64, 128 / PER_CHUNK - 1.5); }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: side, roughness: 0.95 }), [side]);
  const paper = useMemo(() => new THREE.MeshStandardMaterial({ map: mess, roughness: 0.95, side: THREE.DoubleSide }), [mess]);
  const jitter = useMemo(() => { const rnd = seeded(9); return Array.from({ length: MAX_STACKS * CHUNKS }, () => [(rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.07]); }, []);
  const topGeo = useMemo(() => Array.from({ length: MAX_STACKS }, (_, i) => {
    const g = new THREE.PlaneGeometry(W * 0.99, D * 0.99);
    const uv = g.attributes.uv;
    const col = (i * 7) % 4;
    const row = (i * 5) % 12;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (col + uv.getX(k)) / 4, 1 - (row + 1 - uv.getY(k)) / 12);
    return g;
  }), []);
  const fly = useMemo(() => { const rnd = seeded(31); return Array.from({ length: 26 }, (_, i) => ({ x: (rnd() - 0.5) * 9, z: (rnd() - 0.5) * 7, s: 0.5 + rnd(), p: rnd(), g: topGeo[i] })); }, [topGeo]);
  useEffect(() => () => { box.dispose(); side.dispose(); mat.dispose(); paper.dispose(); topGeo.forEach((g) => g.dispose()); }, [box, side, mat, paper, topGeo]);

  const o = useMemo(() => new THREE.Object3D(), []);
  const eye = useRef(new THREE.Vector3(9, 8, 11));
  const aim = useRef(new THREE.Vector3(0, 0.6, 0));
  const last = useRef(-1);

  useFrame(({ clock, pointer }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const target = control.current.sheets * control.current.kept;
    shown.current += (target - shown.current) * (1 - Math.exp(-dt * 2.6));
    const sheets = Math.max(0, shown.current);
    const stacks = Math.min(MAX_STACKS, Math.ceil(sheets / PER_STACK));
    if (Math.abs(sheets - last.current) > 0.4 && body.current) {
      last.current = sheets;
      let k = 0;
      for (let s = 0; s < MAX_STACKS; s++) {
        const here = clamp01((sheets - s * PER_STACK) / PER_STACK) * PER_STACK;
        const [gx, gz] = SPOTS[s];
        let top = 0;
        for (let c = 0; c < CHUNKS; c++) {
          const part = clamp01((here - c * PER_CHUNK) / PER_CHUNK);
          const j = jitter[k];
          const h = PER_CHUNK * SHEET * part;
          o.position.set(gx * 1.75 + j[0], c * PER_CHUNK * SHEET + h / 2, gz * 1.4 + j[1]);
          o.rotation.set(0, j[2], 0);
          o.scale.set(part > 0 ? 1 : 0, Math.max(0.0001, h), part > 0 ? 1 : 0);
          o.updateMatrix();
          body.current.setMatrixAt(k++, o.matrix);
          if (part > 0) top = c * PER_CHUNK * SHEET + h;
        }
        const t = tops.current[s];
        if (t) { t.visible = here > 0.5; t.position.set(gx * 1.75, top + 0.004, gz * 1.4); t.rotation.set(-Math.PI / 2, 0, jitter[s][2] * 3); }
      }
      body.current.instanceMatrix.needsUpdate = true;
    }
    // Sheets leave while the pile is going down, and land while it grows.
    const going = target < shown.current - 6 ? 1 : target > shown.current + 6 ? -1 : 0;
    fly.forEach((f, i) => {
      const m = flying.current[i];
      if (!m) return;
      m.visible = going !== 0;
      const k = (clock.elapsedTime * f.s * 0.9 + f.p) % 1;
      const u = going > 0 ? k : 1 - k;
      m.position.set(f.x * (0.5 + u * 0.8), 0.6 + u * 7, f.z * (0.5 + u * 0.6));
      m.rotation.set(-1.2 + u * 3 * f.s, u * 4, f.p * 6);
      m.scale.setScalar(0.7 * Math.sin(Math.PI * clamp01(k)));
    });
    const spread = 1.6 + Math.sqrt(Math.max(1, stacks)) * 0.95;
    const narrow = size.width / size.height < 1;
    const far = (4.6 + spread * 1.78) * (narrow ? 1.25 : 1);
    const a = 0.72 + pointer.x * 0.16 + Math.sin(clock.elapsedTime * 0.2) * 0.05;
    eye.current.lerp(new THREE.Vector3(Math.sin(a) * far, 1.6 + far * 0.52, Math.cos(a) * far), 1 - Math.exp(-dt * 2.2));
    aim.current.y += (Math.min(1.5, 0.35 + Math.min(1, stacks) * 0.55) - aim.current.y) * 0.06;
    camera.position.copy(eye.current);
    camera.lookAt(aim.current);
    if (++n.current === 4) onReady();
  });
  void smooth01;

  return (
    <>
      <ambientLight intensity={2.3} />
      <directionalLight position={[-7, 12, 6]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-11} shadow-camera-right={11} shadow-camera-top={11} shadow-camera-bottom={-11} shadow-bias={-0.0006} shadow-normalBias={0.03} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><shadowMaterial opacity={0.22} /></mesh>
      <instancedMesh ref={body} args={[box, mat, MAX_STACKS * CHUNKS]} castShadow receiveShadow frustumCulled={false} />
      {topGeo.map((g, i) => <mesh key={i} ref={(el) => { tops.current[i] = el; }} geometry={g} material={paper} receiveShadow visible={false} />)}
      {fly.map((f, i) => <mesh key={`f${i}`} ref={(el) => { flying.current[i] = el; }} geometry={f.g} material={paper} visible={false} />)}
    </>
  );
}

export default function PileCanvas(props: { control: RefObject<PileControl>; onReady: () => void }) {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 34, position: [9, 8, 11] }} gl={{ alpha: true, antialias: true }} style={{ touchAction: "pan-y" }}>
      <Pile {...props} />
    </Canvas>
  );
}
