"use client";

import React, { useState, useRef } from "react";
import { useFileDropAndPaste } from "../hooks/useFileDropAndPaste";
import ImageCompareSlider from "../components/ImageCompareSlider";
import ConfettiCanvas from "../components/ConfettiCanvas";
import { downloadZipBundle, copyImageBlobToClipboard } from "../lib/downloadHelpers";
import { logError } from "../lib/analytics";
import { sounds } from "../lib/soundEffects";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    sounds.playPop();
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

  const { isDragging } = useFileDropAndPaste({
    onFilesAccepted: processFiles,
    accept: ["image/*"],
  });

  const handleDownloadSingle = (img: ProcessedImage) => {
    sounds.playSuccess();
    const savings = ((img.originalSize - img.compressedSize) / img.originalSize) * 100;
    if (savings > 40) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  };

  const handleDownloadAllZip = async () => {
    if (!images.length) return;
    sounds.playSuccess();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);

    const fileList = images.map((img) => ({
      name: `compressed-${img.name}`,
      blob: img.blob,
    }));
    await downloadZipBundle(fileList, "compressed-images.zip");
  };

  const handleCopyBlob = async (img: ProcessedImage) => {
    sounds.playPop();
    const ok = await copyImageBlobToClipboard(img.blob);
    if (ok) {
      setCopiedId(img.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8 pb-32">
      <ConfettiCanvas trigger={showConfetti} />

      {/* Full-screen Dropzone Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 backdrop-blur-md border-4 border-dashed border-indigo-400 p-6 pointer-events-none">
          <div className="text-center space-y-2">
            <span className="text-5xl">📥</span>
            <div className="text-xl font-bold text-white">Drop images to compress locally</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-white">Lossless Image Compressor</h1>
        <p className="text-xs text-slate-400">
          Compress JPG, PNG, and WebP files locally with live split inspection. Paste screenshot (<kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-700 font-mono">Cmd+V</kbd>).
        </p>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sticky Settings Pane */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6 h-fit lg:sticky lg:top-24">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Compression Parameters</div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Target Quality:</span>
              <span className="text-indigo-400 font-mono">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => {
                sounds.playPop();
                setQuality(parseFloat(e.target.value));
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300">Canvas Background:</div>
            <div className="grid grid-cols-3 gap-2">
              {(["checker", "dark", "light"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    sounds.playPop();
                    setBgMode(mode);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                    bgMode === mode
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
            />
            <button
              onClick={() => {
                sounds.playPop();
                fileInputRef.current?.click();
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition shadow-lg shadow-indigo-600/20"
            >
              + Add Images to Compress
            </button>
          </div>
        </div>

        {/* Right Preview & Split Canvas Pane */}
        <div className="lg:col-span-2 space-y-6">
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/30 rounded-3xl p-12 text-center space-y-3 cursor-pointer transition"
            >
              <div className="text-3xl">🖼️</div>
              <div className="text-sm font-bold text-white">No images loaded yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Drag and drop images here, click to browse, or paste directly with <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">Cmd+V</kbd>.
              </p>
            </div>
          ) : (
            images.map((img) => {
              const savings = Math.max(0, Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100));
              return (
                <div key={img.id} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-xs">{img.name}</div>
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
                        {copiedId === img.id ? "✓ Copied!" : "📋 Copy"}
                      </button>
                      <a
                        href={img.compressedSrc}
                        download={`compressed-${img.name}`}
                        onClick={() => handleDownloadSingle(img)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
                      >
                        ⬇️ Save
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
            })
          )}
        </div>
      </div>

      {/* Floating Glass Action Bar */}
      {images.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
          <span className="text-xs font-bold text-white font-mono">{images.length} item{images.length > 1 ? "s" : ""} processed</span>
          <span className="text-slate-600">|</span>
          <button
            onClick={handleDownloadAllZip}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-xs transition shadow-md"
          >
            📦 Download All (.ZIP)
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setImages([]);
            }}
            className="text-xs text-slate-400 hover:text-rose-400 transition px-2"
          >
            Clear All
          </button>
        </div>
      )}
    </main>
  );
}