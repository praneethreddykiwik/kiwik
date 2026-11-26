"use client";

import React, { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";

export interface GlobePlace {
  name: string;
  lat: number;
  lon: number;
}

const RAD = Math.PI / 180;
/** Where the globe comes to rest: over the Arabian Sea, both cities in view. */
const REST = { lat: 17, lon: 64 };

/** A point on the sphere, matching how three lays a map onto SphereGeometry. */
function onGlobe(lat: number, lon: number, r = 1) {
  return new THREE.Vector3(Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.sin(lat * RAD), -Math.cos(lat * RAD) * Math.sin(lon * RAD)).multiplyScalar(r);
}

/** Where the sun is overhead right now, close enough to light the right half. */
function sunDirection(now = new Date()) {
  const day = (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.UTC(now.getUTCFullYear(), 0, 0)) / 864e5;
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
  return onGlobe(-23.44 * Math.cos(((day + 10) / 365.25) * 2 * Math.PI), (12 - hours) * 15);
}

const EARTH_VERT = `
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vNormalView;
varying vec3 vView;
void main() {
  vUv = uv;
  vLocal = normalize(position);
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vNormalView = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const EARTH_FRAG = `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform vec3 uSun;
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vNormalView;
varying vec3 vView;
void main() {
  float sun = dot(vLocal, uSun);
  float day = smoothstep(-.18, .28, sun);
  vec3 land = texture2D(uDay, vUv).rgb;
  vec3 night = texture2D(uNight, vUv).rgb;
  // City lights, a little warmer and brighter than the photograph.
  vec3 lights = pow(night, vec3(1.15)) * vec3(2.6, 2.15, 1.6) + night * vec3(.12, .3, .5);
  vec3 color = mix(lights, land * (.28 + .85 * max(sun, 0.)), day);
  // A warm line where day meets night.
  color += vec3(.42, .2, .1) * .05 * exp(-pow(sun * 9., 2.));
  float rim = pow(1. - max(dot(vNormalView, vView), 0.), 3.);
  color += vec3(.07, .5, .62) * rim * (.45 + .75 * smoothstep(-.4, .5, sun));
  gl_FragColor = vec4(color, 1.);
  #include <colorspace_fragment>
}`;

const AIR_FRAG = `
uniform vec3 uSun;
varying vec3 vLocal;
varying vec3 vNormalView;
varying vec3 vView;
void main() {
  float facing = max(dot(vNormalView, -vView), 0.);
  float glow = pow(smoothstep(.0, .62, facing), 2.6);
  float lit = .3 + .7 * smoothstep(-.55, .5, dot(vLocal, uSun));
  gl_FragColor = vec4(mix(vec3(.16, .27, .72), vec3(.05, .62, .66), lit), glow * lit);
}`;

function Earth({ sun }: { sun: THREE.Vector3 }) {
  const gl = useThree((s) => s.gl);
  const [day, night] = useLoader(THREE.TextureLoader, ["/textures/earth-day.webp", "/textures/earth-night.webp"]);
  const uniforms = useMemo(() => {
    for (const t of [day, night]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
    }
    return { uDay: { value: day }, uNight: { value: night }, uSun: { value: sun } };
  }, [day, night, sun, gl]);

  return (
    <>
      <mesh>
        <sphereGeometry args={[1, 96, 64]} />
        <shaderMaterial vertexShader={EARTH_VERT} fragmentShader={EARTH_FRAG} uniforms={uniforms} />
      </mesh>
      <mesh scale={1.13}>
        <sphereGeometry args={[1, 64, 48]} />
        <shaderMaterial vertexShader={EARTH_VERT} fragmentShader={AIR_FRAG} uniforms={{ uSun: { value: sun } }} side={THREE.BackSide} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

const RING_FRAG = `
uniform float uTime;
varying vec2 vUv;
void main() {
  float r = length(vUv - .5) * 2.;
  float wave = fract(uTime * .45);
  float ring = exp(-pow((r - wave) * 11., 2.)) * (1. - wave);
  float dot_ = 1. - smoothstep(.13, .2, r);
  vec3 c = mix(vec3(.31, .93, .88), vec3(1.), dot_);
  gl_FragColor = vec4(c, max(ring, dot_));
}`;
const PLAIN_VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;

function Pin({ place, label }: { place: GlobePlace; label: RefObject<Map<string, HTMLElement>> }) {
  const ref = useRef<THREE.Mesh>(null);
  const position = useMemo(() => onGlobe(place.lat, place.lon, 1.006), [place]);
  const facing = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()), [position]);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: Math.random() * 2 } }), []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const { camera, size } = useThree();

  useFrame((_, dt) => {
    if (material.current) material.current.uniforms.uTime.value += dt;
    const el = label.current.get(place.name);
    if (!el || !ref.current) return;
    ref.current.getWorldPosition(world);
    const front = normal.copy(world).normalize().dot(normal.clone().copy(camera.position).normalize());
    world.project(camera);
    el.style.transform = `translate(${((world.x + 1) / 2) * size.width}px, ${((1 - world.y) / 2) * size.height}px)`;
    el.style.opacity = String(THREE.MathUtils.clamp((front - 0.3) * 4, 0, 1));
  });

  return (
    <mesh ref={ref} position={position} quaternion={facing}>
      <planeGeometry args={[0.13, 0.13]} />
      {/* React Three Fiber copies uniforms, so the moving one is written on the material itself. */}
      <shaderMaterial ref={material} vertexShader={PLAIN_VERT} fragmentShader={RING_FRAG} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

const ARC_FRAG = `
uniform float uTime;
varying vec2 vUv;
void main() {
  float head = fract(uTime * .28);
  float behind = fract(head - vUv.x);
  float pulse = exp(-behind * 9.);
  float ends = smoothstep(0., .04, vUv.x) * smoothstep(1., .96, vUv.x);
  gl_FragColor = vec4(mix(vec3(.31, .86, .84), vec3(1.), pulse), (.38 + .62 * pulse) * ends);
}`;

function Arc({ from, to }: { from: GlobePlace; to: GlobePlace }) {
  const geometry = useMemo(() => {
    const a = onGlobe(from.lat, from.lon);
    const b = onGlobe(to.lat, to.lon);
    const points: THREE.Vector3[] = [];
    const angle = a.angleTo(b);
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const p = a.clone().multiplyScalar(Math.sin((1 - t) * angle)).add(b.clone().multiplyScalar(Math.sin(t * angle))).divideScalar(Math.sin(angle));
      points.push(p.multiplyScalar(1.006 + Math.sin(Math.PI * t) * angle * 0.22));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.0045, 6, false);
  }, [from, to]);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (material.current) material.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh geometry={geometry}>
      <shaderMaterial ref={material} vertexShader={PLAIN_VERT} fragmentShader={ARC_FRAG} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/** What the page steers: where to look, and how the visitor has dragged it. */
export interface GlobeControl {
  focus: GlobePlace | null;
  dragLon: number;
  dragLat: number;
  touchedAt: number;
}

function Scene({ places, control, labels, onReady }: { places: GlobePlace[]; control: RefObject<GlobeControl>; labels: RefObject<Map<string, HTMLElement>>; onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  // Arrives turning in from the Atlantic.
  const view = useRef({ lat: 5, lon: -40, t: 0 });
  const sun = useMemo(() => sunDirection(), []);
  const frames = useRef(0);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const v = view.current;
    const c = control.current;
    v.t += dt;
    // Left alone for a while, it drifts home.
    if (performance.now() - c.touchedAt > 5000) {
      const back = Math.exp(-dt * 1.2);
      c.dragLon *= back;
      c.dragLat *= back;
    }
    const home = c.focus ?? REST;
    const sway = c.focus ? 0 : Math.sin(v.t * 0.22) * 7;
    const ease = 1 - Math.exp(-dt * 1.9);
    v.lon += (home.lon + sway + c.dragLon - v.lon) * ease;
    v.lat += (THREE.MathUtils.clamp(home.lat + c.dragLat, -55, 65) - v.lat) * ease;
    group.current?.rotation.set(v.lat * RAD, -Math.PI / 2 - v.lon * RAD, 0, "XYZ");
    if (++frames.current === 2) onReady();
  });

  return (
    <group ref={group}>
      <Earth sun={sun} />
      {places.map((p) => <Pin key={p.name} place={p} label={labels} />)}
      {places.length > 1 && <Arc from={places[0]} to={places[1]} />}
    </group>
  );
}

/** The Earth as it is lit at this moment, with Kiwik's locations on it. */
export default function EarthGlobe(props: { places: GlobePlace[]; control: RefObject<GlobeControl>; labels: RefObject<Map<string, HTMLElement>>; onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.55], fov: 42 }}
      flat
      // Liquid glass reads this canvas back, see liquid-glass.tsx.
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
