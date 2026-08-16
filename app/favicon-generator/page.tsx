"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";
import { downloadZipBundle } from "../lib/downloadHelpers";

const SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

export default function FaviconGeneratorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playPop();
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleGenerateZip = async () => {
    if (!imageSrc) return;
    setGenerating(true);
    sounds.playSuccess();

    const img = new Image();
    img.src = imageSrc;
    await new Promise((res) => (img.onload = res));

    const files: { name: string; blob: Blob }[] = [];

    for (const item of SIZES) {
      const canvas = document.createElement("canvas");
      canvas.width = item.size;
      canvas.height = item.size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, item.size, item.size);
        const blob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/png")
        );
        files.push({ name: item.name, blob });
      }
    }

    await downloadZipBundle(files, "favicon-package.zip");
    setGenerating(false);
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Favicon & App Icon Generator</h1>
        <p className="text-xs text-slate-400">
          Generate complete 16px to 512px icon bundles for iOS, Android, and Web in a single .zip file.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6 text-center">
        <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl block cursor-pointer transition bg-slate-950/40">
          <span className="text-3xl mb-2 block">🖼️</span>
          <span className="text-xs font-bold text-white">Select High-Res Logo (PNG, SVG, JPG)</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        {imageSrc && (
          <div className="space-y-4">
            <img src={imageSrc} alt="Preview" className="w-24 h-24 rounded-2xl mx-auto border border-slate-800 shadow-xl object-contain bg-slate-950" />
            <button
              onClick={handleGenerateZip}
              disabled={generating}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
            >
              {generating ? "Generating Multi-res Icons..." : "📦 Package & Download All Favicons (.ZIP)"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}