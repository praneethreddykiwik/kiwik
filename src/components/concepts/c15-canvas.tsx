"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { seeded } from "./gl-util";

export const WORDS = ["Websites", "Mobile apps", "AI agents", "Online stores", "Dashboards"];
const N = 9000;
const HOLD = 1.5;
const MOVE = 0.9;

/** Points that fill a word, in scene units, centred. */
function sample(word: string, family: string, width: number): Float32Array {
  const c = document.createElement("canvas");
  c.width = 1400;
  c.height = 300;
  const x = c.getContext("2d")!;
  x.fillStyle = "#000";
  x.textAlign = "center";
  x.textBaseline = "middle";
  let size = 230;
  x.font = `italic 600 ${size}px ${family}`;
  const fit = (1300 / x.measureText(word).width) * size;
  size = Math.min(size, fit);
  x.font = `italic 600 ${size}px ${family}`;
  x.fillText(word, 700, 150);
  const data = x.getImageData(0, 0, 1400, 300).data;
  const hits: number[] = [];
  for (let y = 0; y < 300; y += 2) for (let X = 0; X < 1400; X += 2) if (data[(y * 1400 + X) * 4 + 3] > 128) hits.push(X, y);
  const out = new Float32Array(N * 3);
  const rnd = seeded(word.length * 31);
  const k = width / 1400;
  for (let i = 0; i < N; i++) {
    const j = Math.floor(rnd() * (hits.length / 2)) * 2;
    out[i * 3] = (hits[j] - 700 + (rnd() - 0.5) * 2) * k;
    out[i * 3 + 1] = (150 - hits[j + 1] + (rnd() - 0.5) * 2) * k;
    out[i * 3 + 2] = (rnd() - 0.5) * 0.25;
  }
  return out;
}

function dot() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Cloud({ dark, onWord, onReady }: { dark: boolean; onWord: (i: number) => void; onReady: () => void }) {
  const { viewport } = useThree();
  const width = Math.min(viewport.width * 0.92, 15);
  const targets = useMemo(() => {
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-playfair").trim() || "Georgia, serif";
    return WORDS.map((w) => sample(w, family, width));
  }, [width]);
  const { geo, mat, offsets } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(targets[0].slice(), 3));
    const col = new Float32Array(N * 3);
    const a = new THREE.Color(dark ? "#9fb3ff" : "#1a2150");
    const b = new THREE.Color(dark ? "#5ee0d0" : "#0d8a80");
    const rnd = seeded(7);
    const off = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const c = a.clone().lerp(b, rnd());
      col.set([c.r, c.g, c.b], i * 3);
      off.set([(rnd() - 0.5) * 2, (rnd() - 0.5) * 2, (rnd() - 0.5) * 2], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({ size: 0.075, map: dot(), vertexColors: true, transparent: true, depthWrite: false, alphaTest: 0.2, toneMapped: false });
    return { geo: g, mat: m, offsets: off };
  }, [targets, dark]);
  useEffect(() => () => {
    geo.dispose();
    mat.map?.dispose();
    mat.dispose();
  }, [geo, mat]);

  const state = useRef({ word: 0, t: 0, frames: 0 });
  const root = useRef<THREE.Points>(null);
  useFrame((s, dt) => {
    const st = state.current;
    if (++st.frames === 3) onReady();
    st.t += Math.min(dt, 0.05);
    const cycle = HOLD + MOVE;
    if (st.t > cycle) {
      st.t -= cycle;
      st.word = (st.word + 1) % WORDS.length;
    }
    const from = targets[st.word];
    const to = targets[(st.word + 1) % WORDS.length];
    const m = st.t < HOLD ? 0 : ease((st.t - HOLD) / MOVE);
    if (st.t >= HOLD && st.t - Math.min(dt, 0.05) < HOLD) onWord((st.word + 1) % WORDS.length);
    const swirl = Math.sin(m * Math.PI);
    const pos = geo.attributes.position.array as Float32Array;
    const time = s.clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      const breathe = 0.02 * Math.sin(time * 1.6 + i);
      pos[k] = from[k] + (to[k] - from[k]) * m + offsets[k] * swirl * 1.6 + breathe;
      pos[k + 1] = from[k + 1] + (to[k + 1] - from[k + 1]) * m + offsets[k + 1] * swirl * 1.1 + breathe;
      pos[k + 2] = from[k + 2] + (to[k + 2] - from[k + 2]) * m + offsets[k + 2] * swirl * 2.5;
    }
    geo.attributes.position.needsUpdate = true;
    if (root.current) root.current.rotation.y = Math.sin(time * 0.3) * 0.12;
  });
  return <points ref={root} geometry={geo} material={mat} />;
}

export default function ParticleCanvas({ dark = false, onWord = () => {}, onReady = () => {} }: { dark?: boolean; onWord?: (i: number) => void; onReady?: () => void }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 9], fov: 40 }} gl={{ alpha: true, powerPreference: "low-power" }} style={{ pointerEvents: "none" }}>
      <Cloud dark={dark} onWord={onWord} onReady={onReady} />
    </Canvas>
  );
}
