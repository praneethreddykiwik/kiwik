"use client";

/*
 * Liquid glass, after https://github.com/dashersw/liquid-glass-js
 * Copyright (c) 2025 Armagan Amcalar, MIT License (THIRD-PARTY-NOTICES.md).
 *
 * The refraction, rim, corner, ripple and tint model is that project's. It
 * bends a html2canvas screenshot of the page, taken once; here the glass reads
 * the live canvas behind it, so what it bends is moving.
 */

import React, { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { useGL } from "./use-gl";

const VERT = `
attribute vec2 a_position;
varying vec2 v_coord;
void main() {
  v_coord = vec2(a_position.x * .5 + .5, .5 - a_position.y * .5);
  gl_Position = vec4(a_position, 0., 1.);
}`;

const FRAG = `
precision highp float;
uniform sampler2D u_image;
uniform vec2 u_size;      // glass, css px
uniform vec2 u_texSize;   // picture behind it, css px
uniform vec2 u_pad;
uniform float u_radius;
uniform float u_tint;
uniform float u_hover;
varying vec2 v_coord;

float shape(vec2 p) {
  vec2 q = abs(p - u_size * .5) - (u_size * .5 - u_radius);
  return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - u_radius;
}

void main() {
  vec2 p = v_coord * u_size;
  float d = shape(p);
  float inside = max(-d, 0.);
  // Away from the nearest point of the shape's axis.
  vec2 axis = clamp(p, vec2(u_radius), u_size - vec2(u_radius));
  vec2 toEdge = p - axis;
  vec2 n = length(toEdge) > .001 ? normalize(toEdge) : vec2(0., 1.);

  float edge = exp(-inside * .15);
  float rim = exp(-inside * .8);
  float bend = edge * (14. + 6. * u_hover) + rim * 26.;
  float ripple = sin(inside * .9) * 3. * rim;
  vec2 px = p + u_pad + n * bend + vec2(-n.y, n.x) * ripple;

  vec3 c = vec3(0.);
  float total = 0.;
  for (float i = -3.; i <= 3.; i += 1.) {
    for (float j = -3.; j <= 3.; j += 1.) {
      float w = exp(-(i * i + j * j) / 5.);
      // Red and blue bend a little differently at the rim, as in real glass.
      vec2 o = vec2(i, j) * 1.15;
      c.r += texture2D(u_image, (px + o + n * edge * 2.) / u_texSize).r * w;
      c.g += texture2D(u_image, (px + o) / u_texSize).g * w;
      c.b += texture2D(u_image, (px + o - n * edge * 2.) / u_texSize).b * w;
      total += w;
    }
  }
  c /= total;

  c = mix(c, mix(vec3(1.), vec3(.7), v_coord.y), u_tint + .06 * u_hover);
  c *= mix(1.08, .92, v_coord.y);
  // Light along the rim, strongest top left and bottom right.
  float lit = pow(abs(dot(n, normalize(vec2(-.7, -1.)))), 2.);
  c += exp(-abs(inside - 1.2) * 1.1) * (.18 + .55 * lit);

  float mask = 1. - smoothstep(-1., .5, d);
  gl_FragColor = vec4(c * mask, mask);
}`;

const PAD = 48;

function compile(gl: WebGLRenderingContext): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** Draws glass over `behind`'s canvas until stopped. Returns null when WebGL is not available. */
function startGlass(canvas: HTMLCanvasElement, host: HTMLElement, behind: HTMLElement, base: string, tint: number, onFrame: () => void) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  const program = gl && compile(gl);
  const picture = document.createElement("canvas");
  const ctx = picture.getContext("2d");
  if (!gl || !program || !ctx) return null;

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
  for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR);
  const u = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = { size: u("u_size"), texSize: u("u_texSize"), pad: u("u_pad"), radius: u("u_radius"), tint: u("u_tint"), hover: u("u_hover") };

  let raf = 0;
  let last = 0;
  let hover = 0;
  let target = 0;
  const enter = () => (target = 1);
  const leave = () => (target = 0);
  host.addEventListener("pointerenter", enter);
  host.addEventListener("pointerleave", leave);

  const draw = (now: number) => {
    raf = requestAnimationFrame(draw);
    if (now - last < 32) return;
    last = now;

    const source = behind.querySelector("canvas");
    const box = canvas.getBoundingClientRect();
    if (!source || !source.width || !box.width || box.bottom < 0 || box.top > window.innerHeight) return;
    const area = source.getBoundingClientRect();
    if (!area.width || !area.height) return;

    const w = Math.round(box.width);
    const h = Math.round(box.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const tw = w + PAD * 2;
    const th = h + PAD * 2;
    if (picture.width !== tw || picture.height !== th) {
      picture.width = tw;
      picture.height = th;
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, tw, th);
    ctx.globalAlpha = Number(getComputedStyle(behind).opacity) || 1;
    ctx.drawImage(source, area.left - box.left + PAD, area.top - box.top + PAD, area.width, area.height);

    hover += (target - hover) * 0.15;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture);
    gl.uniform2f(uniforms.size, w, h);
    gl.uniform2f(uniforms.texSize, tw, th);
    gl.uniform2f(uniforms.pad, PAD, PAD);
    gl.uniform1f(uniforms.radius, Math.min(h / 2, parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0));
    gl.uniform1f(uniforms.tint, tint);
    gl.uniform1f(uniforms.hover, hover);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    onFrame();
  };
  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    host.removeEventListener("pointerenter", enter);
    host.removeEventListener("pointerleave", leave);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

/**
 * Glass over a moving canvas. `behind` holds that canvas; `base` is the colour
 * under it. Until the glass is drawn, or where it cannot be, it is a blurred panel.
 */
export function LiquidGlass({
  behind,
  base,
  tint = 0.14,
  className,
  children,
}: {
  behind: RefObject<HTMLElement | null>;
  base: string;
  tint?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const state = useGL(host, "50px");
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = host.current;
    const source = behind.current;
    if (state !== "on" || !el || !source) return;
    // A context that has been given up cannot be used again, so each run gets its own canvas.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 h-full w-full pointer-events-none";
    el.prepend(canvas);
    let first = true;
    const stop = startGlass(canvas, el, source, base, tint, () => {
      if (first) {
        first = false;
        setDrawn(true);
      }
    });
    return () => {
      stop?.();
      canvas.remove();
      setDrawn(false);
    };
  }, [state, behind, base, tint]);

  return (
    <span
      ref={host}
      className={cn(
        "relative isolate inline-flex overflow-hidden transition-shadow duration-300",
        drawn ? "shadow-[0_10px_30px_rgba(0,0,0,0.28)]" : "bg-white/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)] backdrop-blur-md",
        className
      )}
    >
      <span className="relative flex w-full">{children}</span>
    </span>
  );
}
