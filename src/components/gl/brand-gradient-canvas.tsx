"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

/** Tells the page once there is a picture to show, so it can fade in. */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current === 3) onReady();
  });
  return null;
}

export default function BrandGradientCanvas({
  colors,
  brightness,
  strength,
  density,
  distance,
  onReady,
}: {
  colors: [string, string, string];
  brightness: number;
  strength: number;
  density: number;
  distance: number;
  onReady: () => void;
}) {
  return (
    <ShaderGradientCanvas
      // Liquid glass reads this canvas back, see liquid-glass.tsx.
      preserveDrawingBuffer
      lazyLoad={false}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
      powerPreference="low-power"
    >
      <ShaderGradient
        control="props"
        type="waterPlane"
        animate="on"
        uSpeed={0.16}
        uStrength={strength}
        uDensity={density}
        uFrequency={5.5}
        uAmplitude={0}
        color1={colors[0]}
        color2={colors[1]}
        color3={colors[2]}
        // "env" lighting would download an HDR file from another site.
        lightType="3d"
        brightness={brightness}
        reflection={0.1}
        grain="off"
        cAzimuthAngle={180}
        cPolarAngle={100}
        cDistance={distance}
        cameraZoom={1}
        positionX={0}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
      />
      <FirstFrame onReady={onReady} />
    </ShaderGradientCanvas>
  );
}
