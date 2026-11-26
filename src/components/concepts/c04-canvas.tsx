"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { clamp01, seeded, smooth01, useMessTexture, useShots } from "./gl-util";

const HALF = 3.1;
const TALL = 3.9;
const DOOR = -34;
const END = -82;
/** Where each product hangs. */
export const STOPS = [-44, -54, -64, -74];

const CARD_VERT = `
attribute vec2 aTile; attribute float aSway;
uniform float uTime; uniform float uRush;
varying vec2 vUv; varying vec2 vTile; varying float vDepth;
void main(){
  vUv=uv; vTile=aTile;
  vec3 p=position;
  float lift=sin(uTime*1.4+aSway*6.28)*.03+uRush*sin(uTime*9.+aSway*20.)*.06;
  p.z+=lift*(1.-uv.y)*2.;
  vec4 mv=modelViewMatrix*instanceMatrix*vec4(p,1.);
  vDepth=-mv.z; gl_Position=projectionMatrix*mv;
}`;
const CARD_FRAG = `
uniform sampler2D uMap; uniform vec3 uFog;
varying vec2 vUv; varying vec2 vTile; varying float vDepth;
void main(){
  vec2 uv=vec2((vTile.x+vUv.x)/4.,1.-(vTile.y+1.-vUv.y)/12.);
  vec3 c=texture2D(uMap,uv).rgb;
  float g=dot(c,vec3(.3,.59,.11));
  c=mix(vec3(g),c,.62)*.9;
  float edge=smoothstep(0.,.02,min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y)));
  c*=mix(.86,1.,edge);
  gl_FragColor=vec4(mix(c,uFog,smoothstep(5.,30.,vDepth)),1.);
  #include <colorspace_fragment>
}`;

function Papers({ side }: { side: "all" }) {
  const gl = useThree((s) => s.gl);
  const map = useMessTexture(gl.domElement);
  const ref = useRef<THREE.InstancedMesh>(null);
  const COUNT = 300;
  const { geometry, material, matrices } = useMemo(() => {
    const rnd = seeded(11);
    const g = new THREE.PlaneGeometry(1.25, 1.04, 6, 6);
    const tiles = new Float32Array(COUNT * 2);
    const sway = new Float32Array(COUNT);
    const m: THREE.Matrix4[] = [];
    const o = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      tiles.set([Math.floor(rnd() * 4), Math.floor(rnd() * 12)], i * 2);
      sway[i] = rnd();
      const z = 1 - rnd() * (Math.abs(DOOR) + 0.4);
      const where = rnd();
      const s = 0.75 + rnd() * 0.65;
      o.scale.setScalar(s);
      if (where < 0.4) {
        o.position.set(-HALF + 0.04 + rnd() * 0.12, rnd() * TALL, z);
        o.rotation.set(0, Math.PI / 2 + (rnd() - 0.5) * 0.12, (rnd() - 0.5) * 0.6, "YXZ");
      } else if (where < 0.8) {
        o.position.set(HALF - 0.04 - rnd() * 0.12, rnd() * TALL, z);
        o.rotation.set(0, -Math.PI / 2 + (rnd() - 0.5) * 0.12, (rnd() - 0.5) * 0.6, "YXZ");
      } else if (where < 0.92) {
        o.position.set((rnd() - 0.5) * HALF * 1.9, 0.02 + rnd() * 0.05, z);
        o.rotation.set(-Math.PI / 2, 0, rnd() * 6.28, "XYZ");
      } else {
        // A few still hanging in the air.
        o.position.set((rnd() - 0.5) * 4.4, 0.7 + rnd() * 2.6, z);
        o.rotation.set((rnd() - 0.5) * 0.9, (rnd() - 0.5) * 1.6, (rnd() - 0.5) * 0.9);
      }
      o.updateMatrix();
      m.push(o.matrix.clone());
    }
    g.setAttribute("aTile", new THREE.InstancedBufferAttribute(tiles, 2));
    g.setAttribute("aSway", new THREE.InstancedBufferAttribute(sway, 1));
    const mat = new THREE.ShaderMaterial({ vertexShader: CARD_VERT, fragmentShader: CARD_FRAG, side: THREE.DoubleSide, uniforms: { uMap: { value: map }, uTime: { value: 0 }, uRush: { value: 0 }, uFog: { value: new THREE.Color("#b9b2a6") } } });
    return { geometry: g, material: mat, matrices: m };
  }, [map]);
  useEffect(() => {
    matrices.forEach((m, i) => ref.current?.setMatrixAt(i, m));
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  const lastZ = useRef(0);
  useFrame(({ camera }, dt) => {
    material.uniforms.uTime.value += dt;
    const rush = Math.min(1, Math.abs(camera.position.z - lastZ.current) / Math.max(dt, 0.001) / 14);
    lastZ.current = camera.position.z;
    material.uniforms.uRush.value += (rush - material.uniforms.uRush.value) * 0.1;
  });
  return <instancedMesh ref={ref} args={[geometry, material, COUNT]} frustumCulled={false} key={side} />;
}

function Wall({ at, size, rot, color }: { at: [number, number, number]; size: [number, number]; rot: [number, number, number]; color: string }) {
  return <mesh position={at} rotation={rot}><planeGeometry args={size} /><meshBasicMaterial color={color} side={THREE.DoubleSide} /></mesh>;
}

function Frame({ tex, z, side }: { tex: THREE.Texture | null; z: number; side: 1 | -1 }) {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#232b62", toneMapped: false }), []);
  const mirror = useMemo(() => new THREE.MeshBasicMaterial({ color: "#232b62", transparent: true, opacity: 0.13, toneMapped: false, depthWrite: false }), []);
  useEffect(() => {
    for (const m of [mat, mirror]) {
      m.map = tex;
      m.color.set(tex ? "#ffffff" : "#232b62");
      m.needsUpdate = true;
    }
  }, [tex, mat, mirror]);
  useEffect(() => () => { mat.dispose(); mirror.dispose(); }, [mat, mirror]);
  return (
    <group position={[side * 2.75, 0, z]} rotation={[0, -side * 0.5, 0]}>
      <mesh position={[0, 2.05, 0]} material={mat}><planeGeometry args={[4.6, 2.88]} /></mesh>
      <mesh position={[0, 2.05, -0.05]}><boxGeometry args={[4.76, 3.04, 0.08]} /><meshBasicMaterial color="#10142e" /></mesh>
      <mesh position={[0, -0.9, 0.02]} scale={[1, -1, 1]} material={mirror}><planeGeometry args={[4.6, 2.88]} /></mesh>
    </group>
  );
}

function Corridor({ progress, shots, onReady }: { progress: RefObject<number>; shots: string[]; onReady: () => void }) {
  const { camera, scene, size } = useThree();
  const tex = useShots(shots, 1.6);
  const p = useRef(0);
  const n = useRef(0);
  const dark = useMemo(() => new THREE.Color("#b9b2a6"), []);
  const light = useMemo(() => new THREE.Color("#f4fbfa"), []);
  const now = useMemo(() => new THREE.Color("#b9b2a6"), []);
  const glow = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    scene.background = now;
    scene.fog = new THREE.Fog(now, 10, 46);
    return () => { scene.background = null; scene.fog = null; };
  }, [scene, now]);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = size.width / size.height < 1 ? 74 : 56;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(({ pointer, clock }, dt) => {
    p.current += (progress.current - p.current) * (1 - Math.exp(-dt * 5));
    const z = THREE.MathUtils.lerp(2.2, END + 7.5, p.current);
    const step = z * 1.9;
    camera.position.set(pointer.x * 0.35 + Math.sin(step) * 0.04, 1.75 + Math.abs(Math.sin(step)) * 0.05 + pointer.y * 0.1, z);
    // Looks towards whichever product is coming up.
    let turn = 0;
    STOPS.forEach((s, i) => {
      const d = z - s - 4.6;
      turn += (i % 2 ? 1 : -1) * 0.2 * Math.exp(-(d * d) / 9);
    });
    camera.rotation.set(0, turn - pointer.x * 0.05, Math.sin(clock.elapsedTime * 0.3) * 0.006);
    const out = smooth01((DOOR + 9 - z) / 9);
    now.copy(dark).lerp(light, out);
    if (glow.current) glow.current.opacity = 1 - smooth01((DOOR + 3 - z) / 4);
    if (++n.current === 4) onReady();
  });

  const L = Math.abs(DOOR) + 8;
  const R = Math.abs(END - DOOR) + 14;
  return (
    <>
      <Wall at={[-HALF, TALL / 2, 8 - L / 2]} size={[L, TALL]} rot={[0, Math.PI / 2, 0]} color="#a49d91" />
      <Wall at={[HALF, TALL / 2, 8 - L / 2]} size={[L, TALL]} rot={[0, -Math.PI / 2, 0]} color="#aaa397" />
      <Wall at={[0, 0, 8 - L / 2]} size={[HALF * 2, L]} rot={[-Math.PI / 2, 0, 0]} color="#8f887c" />
      <Wall at={[0, TALL, 8 - L / 2]} size={[HALF * 2, L]} rot={[Math.PI / 2, 0, 0]} color="#b5aea2" />
      <Papers side="all" />
      {/* The way out: all light until you are nearly in it. */}
      <mesh position={[0, TALL / 2, DOOR - 0.6]}><planeGeometry args={[60, 30]} /><meshBasicMaterial ref={glow} color="#ffffff" transparent fog={false} toneMapped={false} /></mesh>
      <Wall at={[0, -0.01, DOOR - R / 2]} size={[60, R]} rot={[-Math.PI / 2, 0, 0]} color="#e8f3f1" />
      {STOPS.map((z, i) => <Frame key={z} z={z} side={i % 2 ? 1 : -1} tex={tex[i] || null} />)}
      {/* And one that is still empty. */}
      <group position={[0, 2.1, END]}>
        <mesh><planeGeometry args={[7.4, 3.6]} /><meshBasicMaterial color="#ffffff" fog={false} /></mesh>
        <mesh position={[0, 0, -0.05]}><boxGeometry args={[7.6, 3.8, 0.08]} /><meshBasicMaterial color="#0d8a80" fog={false} /></mesh>
      </group>
    </>
  );
}

export default function WalkCanvas(props: { progress: RefObject<number>; shots: string[]; onReady: () => void }) {
  return (
    <Canvas flat dpr={[1, 1.6]} camera={{ fov: 56, near: 0.1, far: 120, position: [0, 1.75, 2] }} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ pointerEvents: "none" }} eventSource={typeof document === "undefined" ? undefined : document.body} eventPrefix="client">
      <Corridor {...props} />
    </Canvas>
  );
}
export const walkZ = (p: number) => 2.2 + (END + 7.5 - 2.2) * clamp01(p);
