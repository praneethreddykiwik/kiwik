"use client";

import { proxyMediaUrls } from "@/lib/media";

/**
 * Browser side of the admin media upload (server: app/api/admin/media).
 */

export type UploadedMedia = {
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
};

const MAX_EDGE = 2400;
// Vercel caps request bodies at 4.5MB; stay well under it.
const TARGET_BYTES = 3.5 * 1024 * 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This file could not be read as an image."));
    img.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Downscale large photos before upload. Phone photos are routinely 5–12MB,
 * which Vercel refuses outright; a 2400px WebP keeps them sharp on retina
 * screens at a fraction of the size. GIFs pass through untouched so they keep
 * their animation.
 */
async function prepareImage(file: File): Promise<{ file: File; width?: number; height?: number }> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const needsResize = Math.max(width, height) > MAX_EDGE;
    if (file.type === "image/gif" || (!needsResize && file.size <= TARGET_BYTES)) {
      return { file, width, height };
    }

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return { file, width, height };
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Safari before 17 cannot encode WebP and silently returns PNG; check the type.
    let blob = await canvasToBlob(canvas, "image/webp", 0.86);
    if (!blob || blob.type !== "image/webp") blob = await canvasToBlob(canvas, "image/jpeg", 0.86);
    if (!blob) return { file, width, height };

    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + "." + ext;
    return { file: new File([blob], name, { type: blob.type }), width: canvas.width, height: canvas.height };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function uploadMediaFile(original: File): Promise<UploadedMedia> {
  if (!original.type.startsWith("image/") || original.type === "image/svg+xml") {
    throw new Error("Choose a JPG, PNG, WebP, GIF or AVIF image.");
  }
  const { file, width, height } = await prepareImage(original);

  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("Your admin session expired. Sign in again to upload.");
  if (!res.ok || !data?.url) throw new Error(data?.error || `Upload failed (${res.status}).`);
  return { url: data.url, mimeType: data.mimeType, sizeBytes: data.sizeBytes, width, height };
}

/**
 * Validate a pasted image link before it is saved to the library.
 *
 * Links that only work on the uploader's own machine (blob:, file:, a path on
 * disk) or that point at a web page rather than an image (Google Drive,
 * Dropbox and WhatsApp share links) were accepted silently and then showed as
 * broken images. This loads the link the way the site will, and refuses it if
 * that fails.
 */
export async function checkImageUrl(raw: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Enter an image link." };
  if (/^(blob:|file:|[a-z]:\\|\/Users\/|~\/)/i.test(trimmed)) {
    return { ok: false, error: "That link only exists on your computer. Use “Choose file” to upload it instead." };
  }
  if (!/^(https?:\/\/|\/)/i.test(trimmed)) {
    return { ok: false, error: "Use a full https:// link or a site path starting with /." };
  }
  const url = proxyMediaUrls(trimmed);
  try {
    await loadImage(url);
    return { ok: true, url };
  } catch {
    return {
      ok: false,
      error: "That link did not load as an image. Share pages (Drive, Dropbox, WhatsApp) are not direct image links — download the file and upload it instead.",
    };
  }
}
