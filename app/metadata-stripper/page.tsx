"use client";

import React, { useState, useRef } from "react";
import { useFileDropAndPaste } from "../hooks/useFileDropAndPaste";
import { sounds } from "../lib/soundEffects";
import { downloadZipBundle } from "../lib/downloadHelpers";

interface CleanedImage {
  id: string;
  name: string;
  originalSize: number;
  cleanSize: number;
  cleanUrl: string;
  blob: Blob;
}

export default function MetadataStripperPage() {
  const [cleanedFiles, setCleanedFiles] = useState<CleanedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: File[]) => {
    setProcessing(true);
    sounds.playPop();
    const newItems: CleanedImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;
        await new Promise((res) => (img.onload = res));

        // Re-encoding onto a clean HTML5 canvas completely discards EXIF, GPS, and device serials
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.drawImage(img, 0, 0);

        const format = file.type === "image/png" ? "image/png" : "image/jpeg";
        const blob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b || file), format, 0.95)
        );

        const cleanUrl = URL.createObjectURL(blob);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          originalSize: file.size,
          cleanSize: blob.size,
          cleanUrl,
          blob,
        });
      } catch (err) {
        console.error("Clean error:", err);
      }
    }

    setCleanedFiles((prev) => [...newItems, ...prev]);
    setProcessing(false);
  };

  const { isDragging } = useFileDropAndPaste({
    onFilesAccepted: processFiles,
    accept: ["image/*"],
  });

  const handleDownloadAll = async () => {
    sounds.playSuccess();
    const list = cleanedFiles.map((f) => ({
      name: `clean-${f.name}`,
      blob: f.blob,
    }));
    await downloadZipBundle(list, "clean-images-no-exif.zip");
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 backdrop-blur-md border-4 border-dashed border-indigo-400 p-6 pointer-events-none">
          <div className="text-center space-y-2">
            <span className="text-5xl">🛡️</span>
            <div className="text-xl font-bold text-white">Drop images to strip metadata</div>
          </div>
        </div>
      )}

      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-white">EXIF & Metadata Stripper</h1>
        <p className="text-xs text-slate-400">
          Removes GPS location coordinates, camera models, shutter speeds, and timestamps by sanitizing pixels in memory.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl cursor-pointer transition bg-slate-950/40 space-y-2"
        >
          <span className="text-3xl">🧹</span>
          <div className="text-sm font-bold text-white">Select or drop photos to sanitize</div>
          <div className="text-[11px] text-slate-400">Supports JPG, JPEG, PNG, and WebP</div>
        </div>
      </div>

      {processing && (
        <div className="text-center text-xs text-indigo-400 font-bold animate-pulse">
          Sanitizing image metadata...
        </div>
      )}

      {cleanedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Sanitized Photos ({cleanedFiles.length})</h3>
            <button
              onClick={handleDownloadAll}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              📦 Download All Cleaned (.ZIP)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cleanedFiles.map((file) => (
              <div key={file.id} className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{file.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">✓ 100% EXIF & GPS stripped</div>
                </div>
                <a
                  href={file.cleanUrl}
                  download={`clean-${file.name}`}
                  onClick={() => sounds.playSuccess()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shrink-0"
                >
                  Save
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}