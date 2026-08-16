"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";
import { copyTextToClipboard } from "../lib/downloadHelpers";

interface Swatch {
  hex: string;
  rgb: string;
}

export default function ColorPalettePage() {
  const [colors, setColors] = useState<Swatch[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 100, 100);

      const data = ctx.getImageData(0, 0, 100, 100).data;
      const extracted: Swatch[] = [];

      // Sample 6 representative coordinates across the image
      const coords = [
        [20, 20], [80, 20], [50, 50], [20, 80], [80, 80], [50, 20]
      ];

      coords.forEach(([x, y]) => {
        const idx = (y * 100 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        extracted.push({ hex, rgb: `rgb(${r}, ${g}, ${b})` });
      });

      setColors(extracted);
    };
  };

  const handleCopy = async (hex: string) => {
    sounds.playSuccess();
    await copyTextToClipboard(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Color Palette Extractor</h1>
        <p className="text-xs text-slate-400">
          Extract color swatches and hex codes from any image or brand logo in memory.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6 text-center">
        <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl block cursor-pointer transition bg-slate-950/40">
          <span className="text-2xl mb-1 block">🎨</span>
          <span className="text-xs font-bold text-white">Upload image to extract palette</span>
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>

        {imageSrc && (
          <img src={imageSrc} alt="Preview" className="max-h-48 rounded-xl mx-auto object-contain" />
        )}

        {colors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {colors.map((c, idx) => (
              <div
                key={idx}
                onClick={() => handleCopy(c.hex)}
                className="p-3 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:scale-105 transition space-y-2"
              >
                <div className="h-16 rounded-xl shadow-inner border border-white/10" style={{ backgroundColor: c.hex }} />
                <div className="text-xs font-mono font-bold text-white">
                  {copiedColor === c.hex ? "✓ Copied!" : c.hex}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}