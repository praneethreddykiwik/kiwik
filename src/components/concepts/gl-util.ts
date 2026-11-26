import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { fontsOf, messAtlas, SCENES } from "./mess";

/** All four scenes' paperwork stacked in one texture: 4 across, 12 down. */
export function useMessTexture(el: HTMLCanvasElement, width = 1400): THREE.Texture {
  const tex = useMemo(() => {
    const { sans, hand } = fontsOf(el);
    const parts = SCENES.map((s) => messAtlas(s, hand, sans, width));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = parts[0].height * parts.length;
    const c = canvas.getContext("2d")!;
    parts.forEach((p, i) => c.drawImage(p, 0, i * p.height));
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [el, width]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Product pictures, cropped to the shape they are shown in. Null until each has loaded. */
export function useShots(urls: string[], aspect: number): (THREE.Texture | null)[] {
  const [list, setList] = useState<(THREE.Texture | null)[]>([]);
  const key = urls.join("|");
  useEffect(() => {
    let live = true;
    const loader = new THREE.TextureLoader();
    const all = key ? key.split("|") : [];
    const out: (THREE.Texture | null)[] = all.map(() => null);
    all.forEach((u, i) =>
      loader.load(u, (t) => {
        if (!live) return t.dispose();
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        const img = t.image as { width: number; height: number };
        const ar = img.width / img.height;
        if (ar > aspect) {
          t.repeat.set(aspect / ar, 1);
          t.offset.set((1 - aspect / ar) / 2, 0);
        } else {
          t.repeat.set(1, ar / aspect);
          t.offset.set(0, 1 - ar / aspect);
        }
        out[i] = t;
        setList([...out]);
      })
    );
    return () => {
      live = false;
      out.forEach((t) => t?.dispose());
    };
  }, [key, aspect]);
  return list;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth01 = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const seeded = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
};
