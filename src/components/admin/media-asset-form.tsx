"use client";

import React, { useRef, useState } from "react";
import { ImageOff, Loader2, Upload } from "lucide-react";
import type { MediaItem } from "@/types/site-cms-types";
import { checkImageUrl, uploadMediaFile } from "@/lib/media-upload";
import { cn } from "@/lib/utils";

const FOLDERS = ["General", "Avatars", "Logos", "Banners"];

/**
 * Add an asset to the media library, either by uploading a file or by pasting
 * a link. Both paths verify the image actually loads before it is saved, so a
 * library entry can no longer be a broken thumbnail.
 */
export function MediaAssetForm({
  onAdd,
  onCancel,
  usedIn,
  compact = false,
}: {
  onAdd: (item: MediaItem) => void;
  onCancel?: () => void;
  usedIn: string[];
  compact?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState("General");
  const [busy, setBusy] = useState<null | "upload" | "link">(null);
  const [error, setError] = useState<string | null>(null);

  const finish = (item: Omit<MediaItem, "id" | "folder" | "usedIn" | "createdAt" | "type">) => {
    onAdd({
      ...item,
      id: `med-${Date.now()}`,
      type: "image",
      folder,
      usedIn,
      createdAt: new Date().toISOString(),
    });
    setName("");
    setUrl("");
    setError(null);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy("upload");
    setError(null);
    try {
      const uploaded = await uploadMediaFile(file);
      finish({
        name: name.trim() || file.name.replace(/\.[^.]+$/, ""),
        url: uploaded.url,
        sizeBytes: uploaded.sizeBytes,
        mimeType: uploaded.mimeType,
        dimensions: uploaded.width && uploaded.height ? { width: uploaded.width, height: uploaded.height } : undefined,
        tags: ["uploaded"],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleLink = async () => {
    if (!name.trim()) {
      setError("Give the asset a name.");
      return;
    }
    setBusy("link");
    setError(null);
    const result = await checkImageUrl(url);
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const ext = result.url.split("?")[0].split(".").pop()?.toLowerCase();
    const mime =
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "webp" ? "image/webp" :
      ext === "gif" ? "image/gif" :
      ext === "avif" ? "image/avif" :
      ext === "svg" ? "image/svg+xml" : "image/png";
    finish({ name: name.trim(), url: result.url, sizeBytes: 0, mimeType: mime, tags: ["link"] });
  };

  const inputCls = "w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-text-primary";

  return (
    <div className={cn("rounded-xl bg-white/5 border border-white/10 text-left", compact ? "p-3.5 space-y-3" : "p-5 space-y-4")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Asset Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Defaults to the file name"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Folder</label>
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className={inputCls}>
            {FOLDERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload from this computer */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="w-full py-5 rounded-xl border border-dashed border-accent-blue/40 bg-accent-blue/5 hover:bg-accent-blue/10 text-xs font-bold text-accent-blue flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-wait transition-colors"
        >
          {busy === "upload" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          <span>{busy === "upload" ? "Uploading…" : "Choose file or drop it here"}</span>
          <span className="text-[9px] font-medium text-text-muted">JPG, PNG, WebP, GIF or AVIF — large photos are resized automatically</span>
        </button>
      </div>

      {/* Or paste a link */}
      <div>
        <label className="text-[10px] font-bold text-text-secondary block mb-1">…or paste a direct image link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or /logo.png"
            className={cn(inputCls, "font-mono flex-1")}
          />
          <button
            type="button"
            disabled={busy !== null || !url.trim()}
            onClick={handleLink}
            className="px-4 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-xs text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {busy === "link" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save Link
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[11px] font-semibold text-rose-500 leading-snug" role="alert">{error}</p>
      )}

      {onCancel && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 text-xs font-bold text-text-primary cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/** Library thumbnail that shows a clear placeholder instead of the browser's broken-image icon. */
export function MediaThumb({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-text-muted bg-black/20" title={src || "No link"}>
        <ImageOff className="w-5 h-5 opacity-70" />
        <span className="text-[8px] font-bold uppercase tracking-wider">Link broken</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} className={className} />;
}
