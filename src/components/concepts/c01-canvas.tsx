"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { fontsOf, messAtlas, SCENES } from "./mess";

const COLS = 4;
const ROWS = 3;
const W = 6.4;
const H = 4;
const TW = W / COLS;
const TH = H / ROWS;

/** Seconds: scattered, docking, held, bursting. */
const TIMES = { loose: 2.4, dock: 2.2, hold: 4.6, burst: 1.3 };
export const CYCLE = TIMES.loose + TIMES.dock + TIMES.hold + TIMES.burst;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (x: number) => Math.min(1, Math.max(0, x));

const VERT = `
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
void main() {
  vUv = uv;
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
uniform sampler2D uMess;
uniform sampler2D uScreen;
uniform vec2 uTile;      // column, row from the top
uniform vec2 uCover;     // how much of the picture is used
uniform vec4 uRadius;    // tl tr br bl, as seen from the front of the card
uniform vec2 uSize;
uniform float uDock;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;

float box(vec2 p, vec2 b, vec4 r) {
  r.xy = p.x > 0. ? r.yz : r.xw;
  float k = p.y > 0. ? r.x : r.y;
  vec2 q = abs(p) - b + k;
  return min(max(q.x, q.y), 0.) + length(max(q, 0.)) - k;
}

void main() {
  vec2 p = (vUv - .5) * uSize;
  float d = box(p, uSize * .5, uRadius);
  float aa = fwidth(d);
  float a = 1. - smoothstep(-aa, aa * .5, d);
  if (a < .02) discard;

  vec2 grid = vec2(4., 3.);
  vec3 c;
  vec3 n = normalize(vN);
  if (gl_FrontFacing) {
    vec2 uv = vec2((uTile.x + vUv.x) / grid.x, 1. - (uTile.y + 1. - vUv.y) / grid.y);
    c = texture2D(uMess, uv).rgb;
  } else {
    n = -n;
    vec2 uv = vec2((uTile.x + 1. - vUv.x) / grid.x, (uTile.y + 1. - vUv.y) / grid.y);
    c = texture2D(uScreen, vec2(.5 + (uv.x - .5) * uCover.x, 1. - uv.y * uCover.y)).rgb;
  }
  float light = .74 + .3 * max(dot(n, normalize(vec3(-.35, .6, .9))), 0.);
  float shine = pow(max(dot(reflect(normalize(vP), n), normalize(vec3(-.3, .6, .8))), 0.), 24.);
  c = c * mix(light, 1., uDock * .8) + shine * .12 * (1. - uDock);
  gl_FragColor = vec4(c, a);
  #include <colorspace_fragment>
}`;

const SHADOW = `
varying vec2 vUv;
uniform float uA;
void main() {
  vec2 q = abs(vUv - .5) * 2.;
  float d = length(max(q - .55, 0.)) / .45;
  gl_FragColor = vec4(.06, .09, .24, (1. - smoothstep(0., 1., d)) * uA);
}`;

interface Home {
  pos: THREE.Vector3;
  rot: THREE.Euler;
  delay: number;
  phase: number;
}

function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

/** Where each piece drifts before it is needed: spread out, none of them straight. */
function scatter(scene: number, spread: number): Home[] {
  const rnd = seeded(scene + 3);
  const order = Array.from({ length: 12 }, (_, i) => i).sort(() => rnd() - 0.5);
  return order.map((slot, i) => {
    const col = slot % 4;
    const row = Math.floor(slot / 4);
    return {
      pos: new THREE.Vector3((col - 1.5) * 2.15 * spread + (rnd() - 0.5) * 0.7, (1 - row) * 1.95 + (rnd() - 0.5) * 0.7, (rnd() - 0.5) * 2.6),
      rot: new THREE.Euler((rnd() - 0.5) * 0.7, (rnd() - 0.5) * 0.8, (rnd() - 0.5) * 0.95),
      delay: ((i % 4) * 0.09 + Math.floor(i / 4) * 0.12) / 0.6,
      phase: rnd() * 6.28,
    };
  });
}

export interface PiecesControl {
  scene: number;
  clock: number;
  paused: boolean;
}

function Pieces({ control, screens, onPhase, onReady }: { control: RefObject<PiecesControl>; screens: string[]; onPhase: (scene: number, done: boolean) => void; onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  const cards = useRef<(THREE.Mesh | null)[]>([]);
  const shadows = useRef<(THREE.Mesh | null)[]>([]);
  const slab = useRef<THREE.Mesh>(null);
  const { gl, size } = useThree();
  const spread = size.width / size.height < 0.95 ? 0.72 : 1;
  const homes = useMemo(() => SCENES.map((_, i) => scatter(i, spread)), [spread]);

  const textures = useMemo(() => {
    const { sans, hand } = fontsOf(gl.domElement);
    const mess = SCENES.map((s) => {
      const t = new THREE.CanvasTexture(messAtlas(s, hand, sans, 1600));
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    });
    const blank = new THREE.DataTexture(new Uint8Array([35, 43, 98, 255]), 1, 1);
    blank.colorSpace = THREE.SRGBColorSpace;
    blank.needsUpdate = true;
    const loader = new THREE.TextureLoader();
    const shots = screens.map((url) => {
      const slot: { tex: THREE.Texture; cover: THREE.Vector2 } = { tex: blank, cover: new THREE.Vector2(1, 1) };
      loader.load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        const img = t.image as { width: number; height: number };
        const ar = img.width / img.height;
        slot.cover.set(ar > 1.6 ? 1.6 / ar : 1, ar > 1.6 ? 1 : ar / 1.6);
        slot.tex = t;
      });
      return slot;
    });
    return { mess, shots, blank };
  }, [gl, screens]);

  const materials = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          side: THREE.DoubleSide,
          transparent: true,
          uniforms: {
            uMess: { value: textures.mess[0] },
            uScreen: { value: textures.blank },
            uTile: { value: new THREE.Vector2(i % 4, Math.floor(i / 4)) },
            uCover: { value: new THREE.Vector2(1, 1) },
            uRadius: { value: new THREE.Vector4(0.1, 0.1, 0.1, 0.1) },
            uSize: { value: new THREE.Vector2(TW, TH) },
            uDock: { value: 0 },
          },
        })
      ),
    [textures]
  );
  const shadowMaterials = useMemo(() => Array.from({ length: 13 }, () => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: SHADOW, transparent: true, depthWrite: false, uniforms: { uA: { value: 0.2 } } })), []);

  useEffect(
    () => () => {
      for (const m of [...materials, ...shadowMaterials]) m.dispose();
      for (const t of textures.mess) t.dispose();
      for (const s of textures.shots) s.tex.dispose();
    },
    [materials, shadowMaterials, textures]
  );

  const frames = useRef(0);
  const told = useRef("");
  const look = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const c = control.current;
    if (!c.paused) c.clock += dt;
    if (c.clock >= CYCLE) {
      c.clock = 0;
      c.scene = (c.scene + 1) % SCENES.length;
    }
    const t = c.clock;
    const toDock = clamp((t - TIMES.loose) / TIMES.dock);
    const toBurst = clamp((t - TIMES.loose - TIMES.dock - TIMES.hold) / TIMES.burst);
    const arrive = clamp(t / 1.1);
    const done = toDock >= 0.92 && toBurst < 0.2;
    const key = `${c.scene}${done}`;
    if (told.current !== key) {
      told.current = key;
      onPhase(c.scene, done);
    }
    // While it is whole, the paperwork on the hidden side becomes the next one's.
    const front = toBurst > 0 ? (c.scene + 1) % SCENES.length : c.scene;
    const home = homes[front];
    const shot = textures.shots[c.scene];
    const time = performance.now() / 1000;

    for (let i = 0; i < 12; i++) {
      const mesh = cards.current[i];
      if (!mesh) continue;
      const h = home[i];
      const local = clamp(toDock * 1.9 - h.delay * 0.9 * 0.9);
      const k = toBurst > 0 ? 1 - ease(clamp(toBurst * 1.35 - (h.delay % 0.35))) : ease(local);
      const col = i % 4;
      const row = Math.floor(i / 4);
      const tx = (col - 1.5) * TW;
      const ty = (1 - row) * TH;
      const drift = (1 - k) * (toBurst > 0 ? 1 : 0.4 + 0.6 * arrive);
      const arc = Math.sin(Math.PI * k);
      mesh.position.set(
        THREE.MathUtils.lerp(h.pos.x + Math.sin(time * 0.6 + h.phase) * 0.14 * drift, tx, k),
        THREE.MathUtils.lerp(h.pos.y + Math.cos(time * 0.5 + h.phase * 1.7) * 0.16 * drift, ty, k) + arc * 0.25,
        THREE.MathUtils.lerp(h.pos.z, 0, k) + arc * 1.5
      );
      mesh.rotation.set(
        h.rot.x * (1 - k) + Math.sin(time * 0.7 + h.phase) * 0.06 * drift,
        THREE.MathUtils.lerp(h.rot.y, Math.PI, k),
        h.rot.z * (1 - k)
      );
      const u = materials[i].uniforms;
      u.uMess.value = textures.mess[front];
      u.uScreen.value = shot?.tex ?? textures.blank;
      if (shot) u.uCover.value.copy(shot.cover);
      u.uDock.value = k;
      // Docked, only the outside corners stay round. Seen from behind, left and right swap.
      const r = 0.11 * (1 - k);
      const o = 0.13;
      u.uRadius.value.set(
        row === 0 && col === 3 ? o * k + r : r,
        row === 0 && col === 0 ? o * k + r : r,
        row === 2 && col === 0 ? o * k + r : r,
        row === 2 && col === 3 ? o * k + r : r
      );
      const sh = shadows.current[i];
      if (sh) {
        sh.position.copy(mesh.position).add(new THREE.Vector3(0.12, -0.2, -0.22));
        sh.rotation.set(0, 0, mesh.rotation.z);
        shadowMaterials[i].uniforms.uA.value = 0.2 * (1 - k);
      }
    }
    const whole = toBurst > 0 ? 1 - toBurst : clamp((toDock - 0.6) / 0.4);
    shadowMaterials[12].uniforms.uA.value = 0.34 * whole;
    if (slab.current) slab.current.scale.set(W * 1.22, H * 1.28, 1);

    look.current.x += (pointer.x * 0.16 - look.current.x) * 0.05;
    look.current.y += (pointer.y * 0.1 - look.current.y) * 0.05;
    const tilt = spread < 1 ? 0.6 : 1;
    group.current?.rotation.set(-look.current.y + 0.05 * whole, look.current.x - 0.24 * whole * tilt, 0.012 * Math.sin(time * 0.6) * whole);
    const fit = Math.min(1.12, 1.1 * size.width / size.height / (spread < 1 ? 0.98 : 1.22));
    group.current?.scale.setScalar(fit * (spread < 1 ? 1.02 : 1));
    if (++frames.current === 3) onReady();
  });

  return (
    <group ref={group}>
      <mesh ref={slab} material={shadowMaterials[12]} position={[0.1, -0.32, -0.5]}><planeGeometry /></mesh>
      {materials.map((m, i) => (
        <React.Fragment key={i}>
          <mesh ref={(el) => { shadows.current[i] = el; }} material={shadowMaterials[i]}><planeGeometry args={[TW * 1.3, TH * 1.34]} /></mesh>
          <mesh ref={(el) => { cards.current[i] = el; }} material={m}><planeGeometry args={[TW + 0.004, TH + 0.004]} /></mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

export default function PiecesCanvas(props: { control: RefObject<PiecesControl>; screens: string[]; onPhase: (scene: number, done: boolean) => void; onReady: () => void }) {
  return (
    <Canvas dpr={[1, 2]} flat camera={{ fov: 30, position: [0, 0, 13.4] }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} style={{ touchAction: "pan-y" }}>
      <Pieces {...props} />
    </Canvas>
  );
}
