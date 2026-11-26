"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

function FirstFrame({ onReady }: { onReady: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    if (++n.current === 3) onReady();
  });
  return null;
}

/** ShaderGradient's sphere: a soft ball of light that moves more when it is "thinking". */
export default function OrbCanvas({ colors, busy, onReady, distance = 10 }: { colors: [string, string, string]; busy: boolean; onReady: () => void; distance?: number }) {
  return (
    <ShaderGradientCanvas preserveDrawingBuffer lazyLoad={false} pixelDensity={1} fov={45} pointerEvents="none" powerPreference="low-power">
      <ShaderGradient
        control="props" type="sphere" animate="on"
        uSpeed={busy ? 0.55 : 0.22} uStrength={busy ? 0.75 : 0.42} uDensity={0.9} uFrequency={5.5} uAmplitude={busy ? 2.6 : 1.6}
        color1={colors[0]} color2={colors[1]} color3={colors[2]}
        lightType="3d" brightness={1.35} reflection={0.4} grain="off"
        cAzimuthAngle={250} cPolarAngle={140} cDistance={3} cameraZoom={distance}
        positionX={0} positionY={0} positionZ={0} rotationX={0} rotationY={0} rotationZ={140}
      />
      <FirstFrame onReady={onReady} />
    </ShaderGradientCanvas>
  );
}
