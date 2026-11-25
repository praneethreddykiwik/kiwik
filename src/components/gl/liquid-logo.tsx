"use client";

/*
 * The Kiwik mark in liquid metal, with Paper Shaders (Apache-2.0), the engine
 * behind https://github.com/paper-design/liquid-logo. Its <LiquidMetal> works
 * the logo's shape out in the browser, a quarter of a second of blocked page;
 * kiwik-mark-liquid.webp is that result, saved from public/kiwik-mark.svg with
 * the library's own toProcessedLiquidMetal().
 */

import React from "react";
import { ShaderMount } from "@paper-design/shaders-react";
import { defaultObjectSizing, getShaderColorFromString, liquidMetalFragmentShader, LiquidMetalShapes, ShaderFitOptions } from "@paper-design/shaders";

const UNIFORMS = {
  u_colorBack: getShaderColorFromString("#00000000"),
  u_colorTint: getShaderColorFromString("#ffffff"),
  u_image: "/kiwik-mark-liquid.webp",
  u_contour: 0.5,
  u_distortion: 0.08,
  u_softness: 0.12,
  u_repetition: 2.2,
  u_shiftRed: 0.12,
  u_shiftBlue: 0.22,
  u_angle: 62,
  u_isImage: true,
  u_shape: LiquidMetalShapes.none,
  u_fit: ShaderFitOptions.contain,
  u_scale: 1,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: defaultObjectSizing.originX,
  u_originY: defaultObjectSizing.originY,
  u_worldWidth: 0,
  u_worldHeight: 0,
};

const MIPMAPS = ["u_image"];

export default function LiquidLogo() {
  return (
    <ShaderMount
      style={{ width: "100%", height: "100%" }}
      fragmentShader={liquidMetalFragmentShader}
      uniforms={UNIFORMS}
      mipmaps={MIPMAPS}
      speed={0.7}
      maxPixelCount={900 * 600}
    />
  );
}
