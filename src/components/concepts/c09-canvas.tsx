"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMessTexture, useShots } from "./gl-util";

const R = 6.2;
const ARC = 1.22;
const TALL = (R * ARC) / 1.6;

const VERT = `varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`;
const FRAG = `
uniform sampler2D uShot; uniform sampler2D uMess; uniform float uScene; uniform float uMix; uniform float uLit; uniform vec4 uCrop; uniform float uFade; uniform float uTime;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p,vec2(12.98,78.23)))*43758.5); }
void main(){
  vec2 uv=vec2(1.-vUv.x,vUv.y);
  vec3 shot=texture2D(uShot,uv*uCrop.xy+uCrop.zw).rgb;
  vec2 m=vec2(uv.x,1.-((1.-uv.y)+uScene)/4.);
  vec3 mess=texture2D(uMess,m).rgb; float g=dot(mess,vec3(.3,.59,.11)); mess=mix(vec3(g),mess,.5)*.8;
  // Tile by tile, like a departures board turning over.
  vec2 cell=floor(uv*vec2(24.,15.));
  float t=smoothstep(0.,.18,uMix*1.5-(cell.x/24.)*.9-hash(cell)*.4);
  vec3 c=mix(shot,mess,t);
  float flip=1.-abs(t-.5)*2.; c*=1.-.55*flip;
  vec2 e=min(uv,1.-uv); float edge=smoothstep(0.,.012,e.x)*smoothstep(0.,.018,e.y);
  c*=edge*mix(.3,1.,uLit);
  gl_FragColor=vec4(c,uFade*mix(1.,smoothstep(1.,.15,1.-vUv.y),0.));
  #include <colorspace_fragment>
}`;
const MIRROR_FRAG = FRAG.replace("gl_FragColor=vec4(c,uFade*mix(1.,smoothstep(1.,.15,1.-vUv.y),0.));", "gl_FragColor=vec4(c,.3*pow(1.-vUv.y,2.2)*step(0.,1.)*uFade);");

export interface RoomControl {
  /** Which screen faces the visitor; not wrapped, so turning never jumps back. */
  turn: number;
  drag: number;
  before: boolean;
}

function Room({ control, shots, onReady }: { control: RefObject<RoomControl>; shots: string[]; onReady: () => void }) {
  const { gl, camera, size, scene } = useThree();
  const tex = useShots(shots, 1.6);
  const mess = useMessTexture(gl.domElement, 1400);
  const group = useRef<THREE.Group>(null);
  const n = useRef(0);
  const angle = useRef(-0.9);
  const COUNT = 4;
  const geo = useMemo(() => new THREE.CylinderGeometry(R, R, TALL, 72, 1, true, Math.PI - ARC / 2, ARC), []);
  const frame = useMemo(() => new THREE.CylinderGeometry(R + 0.06, R + 0.06, TALL + 0.16, 72, 1, true, Math.PI - ARC / 2 - 0.014, ARC + 0.028), []);
  const frameMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#05070f", side: THREE.BackSide }), []);
  const blank = useMemo(() => { const t = new THREE.DataTexture(new Uint8Array([24, 32, 80, 255]), 1, 1); t.needsUpdate = true; return t; }, []);
  const make = useMemo(
    () => (fragment: string, i: number) =>
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: fragment, side: THREE.BackSide, transparent: true, depthWrite: fragment === FRAG, uniforms: { uShot: { value: blank }, uMess: { value: mess }, uScene: { value: i }, uMix: { value: 1 }, uLit: { value: 0 }, uCrop: { value: new THREE.Vector4(1, 1, 0, 0) }, uFade: { value: 1 }, uTime: { value: 0 } } }),
    [blank, mess]
  );
  const mats = useMemo(() => Array.from({ length: COUNT }, (_, i) => [make(FRAG, i), make(MIRROR_FRAG, i)] as const), [make]);
  useEffect(() => {
    tex.forEach((t, i) => { if (t) for (const m of mats[i] || []) { m.uniforms.uShot.value = t; m.uniforms.uCrop.value.set(t.repeat.x, t.repeat.y, t.offset.x, t.offset.y); } });
  }, [tex, mats]);
  useEffect(() => () => { geo.dispose(); frame.dispose(); frameMat.dispose(); blank.dispose(); mats.flat().forEach((m) => m.dispose()); }, [geo, frame, frameMat, blank, mats]);
  useEffect(() => {
    scene.background = new THREE.Color("#0d1122");
    return () => { scene.background = null; };
  }, [scene]);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const narrow = size.width / size.height < 1;
    cam.fov = narrow ? 66 : 46;
    cam.position.set(0, 0.35, narrow ? 4.6 : 3.9);
    cam.lookAt(0, narrow ? -0.1 : 0.62, -R);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  const step = (Math.PI * 2) / COUNT;
  useFrame(({ pointer }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const c = control.current;
    angle.current += (c.turn * step + c.drag - angle.current) * (1 - Math.exp(-dt * 4.2));
    if (group.current) group.current.rotation.y = angle.current + pointer.x * 0.04;
    mats.forEach((pair, i) => {
      const off = Math.atan2(Math.sin(angle.current - i * step), Math.cos(angle.current - i * step));
      const lit = Math.max(0, 1 - Math.abs(off) / 1.1);
      const want = lit > 0.55 && !c.before ? 0 : lit > 0.55 ? 1 : 0;
      for (const m of pair) {
        m.uniforms.uLit.value += (lit - m.uniforms.uLit.value) * 0.1;
        m.uniforms.uMix.value += (want - m.uniforms.uMix.value) * (1 - Math.exp(-dt * 2.6));
      }
    });
    if (++n.current === 4) onReady();
  });

  return (
    <>
      <group ref={group}>
        {mats.map(([m, mirror], i) => (
          <group key={i} rotation={[0, -i * step, 0]}>
            <mesh geometry={frame} material={frameMat} />
            <mesh geometry={geo} material={m} />
            <mesh geometry={geo} material={mirror} position={[0, -TALL - 0.16, 0]} scale={[1, -1, 1]} renderOrder={3} />
          </group>
        ))}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -TALL / 2 - 0.1, 0]} renderOrder={2}>
        <circleGeometry args={[14, 64]} />
        <meshBasicMaterial color="#141a33" transparent opacity={0.72} depthWrite={false} />
      </mesh>
    </>
  );
}

export default function RoomCanvas(props: { control: RefObject<RoomControl>; shots: string[]; onReady: () => void }) {
  return (
    <Canvas flat dpr={[1, 1.75]} camera={{ fov: 46, position: [0, 0.35, 2.1] }} gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }} style={{ touchAction: "pan-y" }}>
      <Room {...props} />
    </Canvas>
  );
}
