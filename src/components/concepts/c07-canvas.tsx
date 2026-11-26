"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { drawPiece, fontsOf, SCENES } from "./mess";
import { clamp01 } from "./gl-util";

const VERT = `
uniform float uPeel; uniform vec2 uSize; uniform vec2 uDir; uniform float uR; uniform float uTug;
varying vec2 vUv; varying vec3 vN; varying float vLift; varying float vAfter;
void main(){
  vUv=uv;
  vec2 p=position.xy;
  float reach=abs(uDir.x)*uSize.x*.5+abs(uDir.y)*uSize.y*.5;
  // The roller starts past the far corner and travels across the sheet.
  float c=mix(reach+.02,-reach-uR*3.6,uPeel)-uTug;
  float u=dot(p,uDir)-c;
  vec3 q=vec3(p,0.); vec3 n=vec3(0.,0.,1.);
  vAfter=0.;
  if(u>0.){
    float a=u/uR;
    float along; float z;
    if(a<3.14159){ along=uR*sin(a); z=uR*(1.-cos(a)); n=vec3(-uDir*sin(a),cos(a)); }
    else { along=-(u-3.14159*uR); z=2.*uR; n=vec3(0.,0.,-1.); }
    q.xy=p-uDir*u+uDir*along; q.z=z; vAfter=1.;
  }
  vLift=q.z; vN=normalize(normalMatrix*n);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(q,1.);
}`;
const FRAG = `
uniform sampler2D uMap; uniform vec2 uCover; uniform float uR; uniform float uTop;
varying vec2 vUv; varying vec3 vN; varying float vLift; varying float vAfter;
void main(){
  vec3 n=normalize(vN);
  vec3 c;
  // On a tall phone a whole page is shown, a little below the menu bar, on the page's paper colour.
  float off=uCover.y>1.?.13:0.;
  vec2 st=vec2(.5+(vUv.x-.5)*uCover.x,1.-(1.-vUv.y-off)*uCover.y);
  vec3 under=(st.y<0.||st.y>1.)?vec3(.922,.922,.888):texture2D(uMap,st).rgb;
  if(gl_FrontFacing){ c=under; c*=mix(1.,.78+.28*max(n.z,0.)+.1*n.y,vAfter); }
  else { vec3 g=texture2D(uMap,vec2(.5+(vUv.x-.5)*uCover.x,1.-(1.-vUv.y)*uCover.y)).rgb; c=mix(vec3(.96,.955,.94),g,.07); n=-n; c*=.74+.3*max(n.z,0.)+.08*n.x; }
  gl_FragColor=vec4(c,1.);
  #include <colorspace_fragment>
}`;
const SHADE_FRAG = `
uniform float uPeel; uniform vec2 uSize; uniform vec2 uDir; uniform float uR; uniform float uTug; varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*uSize;
  float reach=abs(uDir.x)*uSize.x*.5+abs(uDir.y)*uSize.y*.5;
  float c=mix(reach+.02,-reach-uR*3.6,uPeel)-uTug;
  float d=dot(p,uDir)-c;
  float s=exp(-pow(max(d,0.)/(uR*2.2),1.4))*step(-.02,d)*.42;
  gl_FragColor=vec4(.04,.06,.14,s*smoothstep(0.,.03,uPeel+uTug*.2));
}`;

/** A sheet full of one kind of paperwork, as big as the screen. */
function drawSheet(i: number, hand: string, sans: string) {
  const W = 2048;
  const H = 1280;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d")!;
  if (i === 0) {
    c.fillStyle = "#fff";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#2e7d4f";
    c.fillRect(0, 0, W, 92);
    c.fillStyle = "#fff";
    c.font = `700 36px ${sans}`;
    c.textBaseline = "middle";
    c.fillText("orders_stock_vendors_FINAL_v7 (copy)", 210, 47);
    c.fillStyle = "#eef2ee";
    c.fillRect(0, 92, W, 54);
    c.strokeStyle = "#d9dfd9";
    c.lineWidth = 2;
    const cols = 10;
    const rh = 56;
    const words = ["Florist", "late", "3 pcs", "??", "call", "unpaid", "#REF!", "Tue", "12,400", "ok", "see other sheet", "Asha", "8,200", "half", "Sound", "done?", "ask R", "Tent", "", ""];
    for (let x = 0; x <= cols; x++) {
      c.beginPath();
      c.moveTo(80 + (x * (W - 80)) / cols, 92);
      c.lineTo(80 + (x * (W - 80)) / cols, H);
      c.stroke();
      c.fillStyle = "#7d877f";
      c.font = `600 26px ${sans}`;
      c.fillText(String.fromCharCode(65 + x), 80 + ((x + 0.45) * (W - 80)) / cols, 120);
    }
    for (let r = 0; r < 22; r++) {
      const y = 146 + r * rh;
      c.beginPath();
      c.moveTo(0, y + rh);
      c.lineTo(W, y + rh);
      c.stroke();
      c.fillStyle = "#7d877f";
      c.font = `500 24px ${sans}`;
      c.fillText(String(r + 1), 26, y + rh / 2);
      for (let x = 0; x < cols; x++) {
        const k = (r * 7 + x * 13 + ((r * x) % 5)) % words.length;
        const w = words[k];
        const px = 80 + (x * (W - 80)) / cols;
        if (k === 6 || k === 5) {
          c.fillStyle = "#ffe1dc";
          c.fillRect(px + 1, y + 1, (W - 80) / cols - 2, rh - 2);
        } else if (k === 3 || k === 15) {
          c.fillStyle = "#fff3c4";
          c.fillRect(px + 1, y + 1, (W - 80) / cols - 2, rh - 2);
        }
        c.fillStyle = k === 6 || k === 5 ? "#b23a26" : "#48504a";
        c.font = `500 26px ${sans}`;
        c.fillText(w, px + 14, y + rh / 2, (W - 80) / cols - 20);
      }
    }
  } else {
    c.fillStyle = ["", "#dfe5ea", "#efe9dd", "#e6e1ee"][i];
    c.fillRect(0, 0, W, H);
    const kinds = [[], ["chat", "call"], ["bill", "note"], ["mail", "chat", "note"]][i];
    const pieces = SCENES.flatMap((s) => s.pieces).filter((p) => kinds.includes(p.kind));
    let n = 0;
    for (let r = 0; r < 4; r++)
      for (let x = 0; x < 6; x++) {
        const w = 372;
        c.save();
        c.translate(-40 + x * 366 + (r % 2) * -70 + w / 2, -20 + r * 338 + 155);
        c.rotate(((((r * 5 + x * 3) % 7) - 3) / 3) * 0.05);
        c.shadowColor = "rgba(30,34,50,.28)";
        c.shadowBlur = 26;
        c.shadowOffsetY = 10;
        c.fillStyle = "#fff";
        c.fillRect(-w / 2, -155, w, 310);
        c.shadowColor = "transparent";
        c.translate(-w / 2, -155);
        c.beginPath();
        c.rect(0, 0, w, 310);
        c.clip();
        drawPiece(c, pieces[(n++ * 5) % pieces.length], w, 310, hand, sans);
        c.restore();
      }
  }
  return canvas;
}

export interface PeelState {
  /** 0 to 8: every whole number is one sheet gone. */
  p: number;
  tug: number;
}

function Stack({ state, shots, onReady }: { state: RefObject<PeelState>; shots: string[]; onReady: () => void }) {
  const { gl, size, camera, viewport } = useThree();
  const p = useRef(0);
  const n = useRef(0);
  const layers = useMemo(() => {
    const { sans, hand } = fontsOf(gl.domElement);
    return Array.from({ length: 8 }, (_, i) => {
      const uniforms = () => ({ uMap: { value: null as THREE.Texture | null }, uPeel: { value: 0 }, uSize: { value: new THREE.Vector2(1, 1) }, uDir: { value: new THREE.Vector2(0.94, i % 2 ? 0.34 : -0.34).normalize() }, uR: { value: 0.34 }, uCover: { value: new THREE.Vector2(1, 1) }, uTug: { value: 0 }, uTop: { value: 0 } });
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide, uniforms: uniforms() });
      const shade = new THREE.ShaderMaterial({ vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }", fragmentShader: SHADE_FRAG, transparent: true, depthWrite: false, uniforms: uniforms() });
      let ar = 1.6;
      if (i % 2 === 0) {
        const t = new THREE.CanvasTexture(drawSheet(i / 2, hand, sans));
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        mat.uniforms.uMap.value = t;
      } else {
        const blank = new THREE.DataTexture(new Uint8Array([20, 26, 68, 255]), 1, 1);
        blank.colorSpace = THREE.SRGBColorSpace;
        blank.needsUpdate = true;
        mat.uniforms.uMap.value = blank;
        new THREE.TextureLoader().load(shots[(i - 1) / 2], (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
          const img = t.image as { width: number; height: number };
          layer.ar = img.width / img.height;
          mat.uniforms.uMap.value = t;
        });
      }
      const layer = { mat, shade, ar };
      return layer;
    });
  }, [gl, shots]);
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1, 150, 90), []);
  useEffect(() => () => { geo.dispose(); layers.forEach((l) => { (l.mat.uniforms.uMap.value as THREE.Texture)?.dispose(); l.mat.dispose(); l.shade.dispose(); }); }, [geo, layers]);
  // Vertices are placed in real units, so the plane is sized through its attributes.
  const W = viewport.width * 1.002;
  const H = viewport.height * 1.002;
  const sized = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, H, 150, 90);
    return g;
  }, [W, H]);
  useEffect(() => () => sized.dispose(), [sized]);
  void size;
  void camera;

  useFrame(({ clock }, dt) => {
    p.current += (state.current.p - p.current) * (1 - Math.exp(-Math.min(dt, 0.05) * 7));
    const ar = W / H;
    layers.forEach((l, i) => {
      const peel = clamp01(p.current - i);
      const idle = i === Math.floor(p.current + 0.001) && peel < 0.02 ? (i % 2 === 0 ? 1.75 + Math.sin(clock.elapsedTime * 1.7) * 0.22 + state.current.tug : 0) : 0;
      for (const m of [l.mat, l.shade]) {
        const u = m.uniforms;
        u.uPeel.value = peel * peel * (3 - 2 * peel);
        u.uSize.value.set(W, H);
        u.uR.value = Math.min(W, H) * 0.085;
        u.uTug.value += (idle - u.uTug.value) * 0.12;
        // On a tall screen a product is shown whole across the top, not cropped to a sliver.
        if (i % 2 === 1 && ar < 0.9) u.uCover.value.set(1, l.ar / ar);
        else u.uCover.value.set(l.ar > ar ? ar / l.ar : 1, l.ar > ar ? 1 : l.ar / ar);
      }
    });
    if (++n.current === 4) onReady();
  });

  return (
    <>
      {layers.map((l, i) => (
        <group key={i} position={[0, 0, -i * 0.012]}>
          <mesh geometry={sized} material={l.mat} frustumCulled={false} renderOrder={20 - i * 2} />
          <mesh geometry={sized} material={l.shade} position={[0, 0, -0.006]} frustumCulled={false} renderOrder={19 - i * 2} />
        </group>
      ))}
    </>
  );
}

export default function PeelCanvas(props: { state: RefObject<PeelState>; shots: string[]; onReady: () => void }) {
  return (
    <Canvas flat dpr={[1, 1.75]} camera={{ fov: 35, position: [0, 0, 8], near: 0.1, far: 40 }} gl={{ antialias: true }} style={{ touchAction: "pan-y" }}>
      <Stack {...props} />
    </Canvas>
  );
}
