"use client";

import React, { useState, useRef } from "react";
import { useFileDropAndPaste } from "../hooks/useFileDropAndPaste";
import ImageCompareSlider from "../components/ImageCompareSlider";
import { downloadZipBundle, copyImageBlobToClipboard } from "../lib/downloadHelpers";
import { logError } from "../lib/analytics";

interface ProcessedImage {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalSrc: string;
  compressedSrc: string;
  blob: Blob;
}

export default function ImageCompressorPage() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [quality, setQuality] = useState<number>(0.8);
  const [bgMode, setBgMode] = useState<"checker" | "dark" | "light">("checker");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    const newItems: ProcessedImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const originalSrc = URL.createObjectURL(file);
        const img = new Image();
        img.src = originalSrc;
        await new Promise((res) => (img.onload = res));

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        ctx.drawImage(img, 0, 0);

        const targetFormat = file.type === "image/png" ? "image/png" : "image/jpeg";
        const blob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b || file), targetFormat, quality)
        );

        const compressedSrc = URL.createObjectURL(blob);

        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          originalSize: file.size,
          compressedSize: blob.size,
          originalSrc,
          compressedSrc,
          blob,
        });
      } catch (err: any) {
        logError("image-compressor", err?.message || "Compression error");
      }
    }

    setImages((prev) => [...newItems, ...prev]);
    setIsProcessing(false);
  };

  // Full-screen drag-and-drop & clipboard paste hook
  const { isDragging } = useFileDropAndPaste({
    onFilesAccepted: processFiles,
    accept: ["image/*"],
  });

  const handleDownloadAllZip = async () => {
    if (!images.length) return;
    const fileList = images.map((img) => ({
      name: `compressed-${img.name}`,
      blob: img.blob,
    }));
    await downloadZipBundle(fileList, "compressed-images.zip");
  };

  const handleCopyBlob = async (img: ProcessedImage) => {
    const ok = await copyImageBlobToClipboard(img.blob);
    if (ok) {
      setCopiedId(img.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Drag & Drop Full-screen Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 backdrop-blur-md border-4 border-dashed border-indigo-400 p-6 pointer-events-none">
          <div className="text-center space-y-2">
            <span className="text-5xl">📥</span>
            <div className="text-xl font-bold text-white">Drop images to compress instantly</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-white">Lossless Image Compressor</h1>
        <p className="text-xs text-slate-400">
          Compress JPG, PNG, and WebP files locally. Paste from clipboard (<code>Cmd+V</code>) or drop files anywhere.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-[240px]">
          <label className="text-xs font-bold text-slate-300">Quality: {Math.round(quality * 100)}%</label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Background Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Canvas Bg:</span>
          {(["checker", "dark", "light"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setBgMode(mode)}
              className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition ${
                bgMode === mode
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
          >
            + Upload Images
          </button>
          {images.length > 1 && (
            <button
              onClick={handleDownloadAllZip}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
            >
              📦 Download All (.ZIP)
            </button>
          )}
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-center py-6 text-xs text-indigo-400 font-bold animate-pulse">
          Processing in browser memory...
        </div>
      )}

      {/* Processed Images List */}
      <div className="space-y-8">
        {images.map((img) => {
          const savings = Math.max(0, Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100));
          return (
            <div key={img.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white truncate max-w-sm">{img.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Original: {(img.originalSize / 1024).toFixed(1)} KB</span>
                    <span>→</span>
                    <span className="text-emerald-400 font-bold">
                      Compressed: {(img.compressedSize / 1024).toFixed(1)} KB (-{savings}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyBlob(img)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                  >
                    {copiedId === img.id ? "✓ Copied!" : "📋 Copy Image"}
                  </button>
                  <a
                    href={img.compressedSrc}
                    download={`compressed-${img.name}`}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    ⬇️ Download
                  </a>
                </div>
              </div>

              {/* Interactive Before / After Split Slider */}
              <ImageCompareSlider
                originalSrc={img.originalSrc}
                compressedSrc={img.compressedSrc}
                bgMode={bgMode}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}